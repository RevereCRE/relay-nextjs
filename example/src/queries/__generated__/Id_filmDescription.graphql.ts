/**
 * @generated SignedSource<<ed9ee293b0eda0b05416355b644db88d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Id_filmDescription$data = {
  readonly director: string | null;
  readonly openingCrawl: string | null;
  readonly " $fragmentType": "Id_filmDescription";
};
export type Id_filmDescription$key = {
  readonly " $data"?: Id_filmDescription$data;
  readonly " $fragmentSpreads": FragmentRefs<"Id_filmDescription">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Id_filmDescription",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "director",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "openingCrawl",
      "storageKey": null
    }
  ],
  "type": "Film",
  "abstractKey": null
};

(node as any).hash = "0cff8413ec741c40ba2da65ea4176a9b";

export default node;
