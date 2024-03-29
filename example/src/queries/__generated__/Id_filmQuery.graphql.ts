/**
 * @generated SignedSource<<09ea506460f6041b1df834301726692e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Id_filmQuery$variables = {
  id: string;
};
export type Id_filmQuery$data = {
  readonly film: {
    readonly title: string | null;
    readonly " $fragmentSpreads": FragmentRefs<"Id_filmDescription">;
  } | null;
};
export type Id_filmQuery = {
  variables: Id_filmQuery$variables;
  response: Id_filmQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Id_filmQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Film",
        "kind": "LinkedField",
        "name": "film",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Id_filmDescription"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "Id_filmQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Film",
        "kind": "LinkedField",
        "name": "film",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "db6af483ec2e52c7c7359182fe7688db",
    "id": null,
    "metadata": {},
    "name": "Id_filmQuery",
    "operationKind": "query",
    "text": "query Id_filmQuery(\n  $id: ID!\n) {\n  film(id: $id) {\n    title\n    ...Id_filmDescription\n    id\n  }\n}\n\nfragment Id_filmDescription on Film {\n  director\n  openingCrawl\n}\n"
  }
};
})();

(node as any).hash = "3573cf75b79f7fd10e324897f10a7d3a";

export default node;
