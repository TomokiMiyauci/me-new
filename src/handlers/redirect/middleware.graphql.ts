// deno-lint-ignore-file
// deno-fmt-ignore-file
import * as Types from '@/graphql/types.ts';

import type { TypedObject } from "@portabletext/types";
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type RedirectQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type RedirectQuery = { __typename?: 'RootQuery', allRedirect: Array<{ __typename?: 'Redirect', from?: string | null, to?: string | null, permanent?: boolean | null }> };


export const RedirectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Redirect"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allRedirect"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"permanent"}}]}}]}}]} as unknown as DocumentNode<RedirectQuery, RedirectQueryVariables>;