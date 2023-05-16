/**
 * @fileoverview Functions for extracting and applying serialization metadata
 * to JSON. When a JS object is serialized to JSON it will call the `toJSON`
 * and `toString` methods on objects. When deserializing the original types of
 * those values are lost. This library exports `collectMeta` which returns a
 * JSON-serializable representation of how the original object will be
 * serialized. This can be passed to `hydrateObject` to restore the
 * original object. Currently supports `Date` and `URL` values.
 */

/** Type of value that can be restored. */
export enum EncodedType {
  DATE = 'date',
  URL = 'url',
}

export type HydrationMeta = Record<string, EncodedType>;

/**
 * Restores the type of values after deserializing a JSON object. Meta must be
 * the object returned from `collectMeta`. Mutates the object in place.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hydrateObject(meta: HydrationMeta, value: any) {
  for (const [path, encoding] of Object.entries(meta)) {
    let updatingValue = value;
    const parts = path.split('.');

    for (let i = 0; i < parts.length - 1; ++i) {
      let accessor: string | number = Number(parts[i]);
      if (Number.isNaN(accessor)) {
        accessor = parts[i]!;
      }

      updatingValue = updatingValue[accessor];
    }

    let lastAccessor: string | number = Number(parts[parts.length - 1]);
    if (Number.isNaN(lastAccessor)) {
      lastAccessor = parts[parts.length - 1]!;
    }

    switch (encoding) {
      case EncodedType.DATE:
        updatingValue[lastAccessor] = new Date(updatingValue[lastAccessor]);
        break;
      case EncodedType.URL:
        updatingValue[lastAccessor] = new URL(updatingValue[lastAccessor]);
        break;
      default:
        checkExhaustive(encoding);
    }
  }
}

function* walk(): Generator<
  string,
  void,
  { parent: {}; key: string; value: unknown }
> {
  const path: [string, unknown][] = [];

  do {
    const { parent, key, value } = yield path.map(([key]) => key).join('.');
    while (path.length > 0 && path[path.length - 1]![1] !== parent) {
      path.pop();
    }

    path.push([key, value]);
  } while (path.length > 0);
}

function createReplacer() {
  const meta: HydrationMeta = {};
  const walker = walk();

  function replacer(
    this: Record<string, unknown>,
    key: string,
    value: unknown
  ) {
    const path = walker.next({ parent: this, key, value }).value;
    if (path && this[key] instanceof Date) {
      meta[path] = EncodedType.DATE;
    } else if (path && this[key] instanceof URL) {
      meta[path] = EncodedType.URL;
    }

    return value;
  }

  return [replacer, () => meta] as const;
}

/**
 * Walks an object and extracts information for hydrating it after
 * deserialization.
 */
export function collectMeta(obj: unknown) {
  const [replacer, dumpMeta] = createReplacer();
  JSON.stringify(obj, replacer);
  return dumpMeta();
}

function checkExhaustive(cased: never): asserts cased is never {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(`Unexpected condition: ${cased}`);
  }

  return undefined;
}
