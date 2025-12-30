// deno-lint-ignore-file
// deno-fmt-ignore-file
import * as Types from '@/graphql/types.ts';

import type { TypedObject } from "@portabletext/types";
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PostSlugsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type PostSlugsQuery = { __typename?: 'RootQuery', posts: Array<{ __typename?: 'Post', lang?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null }> };


export const PostSlugsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PostSlugs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"posts"},"name":{"kind":"Name","value":"allPost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"lang"},"name":{"kind":"Name","value":"language"}}]}}]}}]} as unknown as DocumentNode<PostSlugsQuery, PostSlugsQueryVariables>;