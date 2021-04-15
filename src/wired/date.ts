const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,}|)Z$/;

export function withHydrateDatetime(
  _key: string,
  value: unknown
): Date | unknown {
  // `new Date` accepts things that aren't necessarily valid JSON timestamps,
  // for example `new Date('80')` works. Validating that we're actually
  // converting a JSON timestamp avoids unintentional coercion.
  if (typeof value === 'string' && dateFormat.test(value)) {
    return new Date(value);
  }

  return value;
}
