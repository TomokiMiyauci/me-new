// deno-lint-ignore-file
// deno-fmt-ignore-file
import * as Types from '../../graphql/types.ts';

import type { TypedObject } from "@portabletext/types";
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PrivacyPolicyQueryVariables = Types.Exact<{
  lang: Types.Scalars['String']['input'];
}>;


export type PrivacyPolicyQuery = { __typename?: 'RootQuery', allLegalDocument: Array<{ __typename?: 'LegalDocument', bodyRaw?: TypedObject[] | null }> };


export const PrivacyPolicyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PrivacyPolicy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lang"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allLegalDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"StringValue","value":"privacy_policy","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"language"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lang"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bodyRaw"}}]}}]}}]} as unknown as DocumentNode<PrivacyPolicyQuery, PrivacyPolicyQueryVariables>;