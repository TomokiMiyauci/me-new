/* eslint-disable */
import * as types from './graphql.ts';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "fragment Post_post_meta on Post {\n  title\n  description\n  categories {\n    name\n  }\n  tags {\n    name\n  }\n  createdAt\n  _createdAt\n  updatedAt\n  _updatedAt\n}": typeof types.Post_Post_MetaFragmentDoc,
    "query PostBySlug($slug: String!, $lang: String!) {\n  allPost(where: {slug: {current: {eq: $slug}}, language: {eq: $lang}}) {\n    ...Post_post_meta\n    id: _id\n    title\n    bodyRaw\n    description\n    categories {\n      name\n    }\n    tags {\n      name\n    }\n    _createdAt\n    _updatedAt\n    createdAt\n    updatedAt\n  }\n}": typeof types.PostBySlugDocument,
    "query TranslationBySlug($id: ID!) {\n  allTranslationMetadata(where: {_: {references: $id}}) {\n    translations {\n      value {\n        __typename\n        ... on Post {\n          slug {\n            current\n          }\n          language\n        }\n      }\n    }\n  }\n}": typeof types.TranslationBySlugDocument,
    "query GetAllPost($lang: String!) {\n  allPost(where: {language: {eq: $lang}}) {\n    ...Article_article\n    key: _id\n    slug {\n      current\n    }\n  }\n}": typeof types.GetAllPostDocument,
    "query PrivacyPolicy($lang: String!) {\n  allLegalDocument(where: {type: {eq: \"privacy_policy\"}, language: {eq: $lang}}) {\n    bodyRaw\n  }\n}": typeof types.PrivacyPolicyDocument,
    "fragment Article_article on Post {\n  _id\n  title\n  description\n  createdAt\n  _createdAt\n  coverImage {\n    ...Image_image\n  }\n}": typeof types.Article_ArticleFragmentDoc,
    "fragment Image_image on Image {\n  asset {\n    _id\n    assetId\n    path\n    url\n    metadata {\n      dimensions {\n        width\n        height\n      }\n      lqip\n    }\n  }\n}": typeof types.Image_ImageFragmentDoc,
};
const documents: Documents = {
    "fragment Post_post_meta on Post {\n  title\n  description\n  categories {\n    name\n  }\n  tags {\n    name\n  }\n  createdAt\n  _createdAt\n  updatedAt\n  _updatedAt\n}": types.Post_Post_MetaFragmentDoc,
    "query PostBySlug($slug: String!, $lang: String!) {\n  allPost(where: {slug: {current: {eq: $slug}}, language: {eq: $lang}}) {\n    ...Post_post_meta\n    id: _id\n    title\n    bodyRaw\n    description\n    categories {\n      name\n    }\n    tags {\n      name\n    }\n    _createdAt\n    _updatedAt\n    createdAt\n    updatedAt\n  }\n}": types.PostBySlugDocument,
    "query TranslationBySlug($id: ID!) {\n  allTranslationMetadata(where: {_: {references: $id}}) {\n    translations {\n      value {\n        __typename\n        ... on Post {\n          slug {\n            current\n          }\n          language\n        }\n      }\n    }\n  }\n}": types.TranslationBySlugDocument,
    "query GetAllPost($lang: String!) {\n  allPost(where: {language: {eq: $lang}}) {\n    ...Article_article\n    key: _id\n    slug {\n      current\n    }\n  }\n}": types.GetAllPostDocument,
    "query PrivacyPolicy($lang: String!) {\n  allLegalDocument(where: {type: {eq: \"privacy_policy\"}, language: {eq: $lang}}) {\n    bodyRaw\n  }\n}": types.PrivacyPolicyDocument,
    "fragment Article_article on Post {\n  _id\n  title\n  description\n  createdAt\n  _createdAt\n  coverImage {\n    ...Image_image\n  }\n}": types.Article_ArticleFragmentDoc,
    "fragment Image_image on Image {\n  asset {\n    _id\n    assetId\n    path\n    url\n    metadata {\n      dimensions {\n        width\n        height\n      }\n      lqip\n    }\n  }\n}": types.Image_ImageFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment Post_post_meta on Post {\n  title\n  description\n  categories {\n    name\n  }\n  tags {\n    name\n  }\n  createdAt\n  _createdAt\n  updatedAt\n  _updatedAt\n}"): (typeof documents)["fragment Post_post_meta on Post {\n  title\n  description\n  categories {\n    name\n  }\n  tags {\n    name\n  }\n  createdAt\n  _createdAt\n  updatedAt\n  _updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PostBySlug($slug: String!, $lang: String!) {\n  allPost(where: {slug: {current: {eq: $slug}}, language: {eq: $lang}}) {\n    ...Post_post_meta\n    id: _id\n    title\n    bodyRaw\n    description\n    categories {\n      name\n    }\n    tags {\n      name\n    }\n    _createdAt\n    _updatedAt\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query PostBySlug($slug: String!, $lang: String!) {\n  allPost(where: {slug: {current: {eq: $slug}}, language: {eq: $lang}}) {\n    ...Post_post_meta\n    id: _id\n    title\n    bodyRaw\n    description\n    categories {\n      name\n    }\n    tags {\n      name\n    }\n    _createdAt\n    _updatedAt\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query TranslationBySlug($id: ID!) {\n  allTranslationMetadata(where: {_: {references: $id}}) {\n    translations {\n      value {\n        __typename\n        ... on Post {\n          slug {\n            current\n          }\n          language\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query TranslationBySlug($id: ID!) {\n  allTranslationMetadata(where: {_: {references: $id}}) {\n    translations {\n      value {\n        __typename\n        ... on Post {\n          slug {\n            current\n          }\n          language\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAllPost($lang: String!) {\n  allPost(where: {language: {eq: $lang}}) {\n    ...Article_article\n    key: _id\n    slug {\n      current\n    }\n  }\n}"): (typeof documents)["query GetAllPost($lang: String!) {\n  allPost(where: {language: {eq: $lang}}) {\n    ...Article_article\n    key: _id\n    slug {\n      current\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PrivacyPolicy($lang: String!) {\n  allLegalDocument(where: {type: {eq: \"privacy_policy\"}, language: {eq: $lang}}) {\n    bodyRaw\n  }\n}"): (typeof documents)["query PrivacyPolicy($lang: String!) {\n  allLegalDocument(where: {type: {eq: \"privacy_policy\"}, language: {eq: $lang}}) {\n    bodyRaw\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment Article_article on Post {\n  _id\n  title\n  description\n  createdAt\n  _createdAt\n  coverImage {\n    ...Image_image\n  }\n}"): (typeof documents)["fragment Article_article on Post {\n  _id\n  title\n  description\n  createdAt\n  _createdAt\n  coverImage {\n    ...Image_image\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment Image_image on Image {\n  asset {\n    _id\n    assetId\n    path\n    url\n    metadata {\n      dimensions {\n        width\n        height\n      }\n      lqip\n    }\n  }\n}"): (typeof documents)["fragment Image_image on Image {\n  asset {\n    _id\n    assetId\n    path\n    url\n    metadata {\n      dimensions {\n        width\n        height\n      }\n      lqip\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;