# me

## Sanity

We will use Sanity as our CMS.

### Sanity CLI

Sanity CLI is primarily used for deploying GraphQL. Unfortunately, Sanity CLI
does not work on the Deno runtime.

There are several reasons for this. First, Sanity CLI uses `createRequire` from
`node:module` to load the sanity config and other files. However, when loaded
this way, Deno adheres strictly to the Node.js approach. Consequently, it does
not resolve JSR modules or import maps. It is unclear whether this is an
intentional limitation.

Additionally, Sanity CLI internally uses `node:worker_threads` and DOM
environment polyfills. Deno's implementation causes issues with this, exhibiting
behavior where `postMessage` on the `parentPort` is removed, preventing the
program from completing.

Until this is resolved, use the Sanity CLI via npm. Therefore, all code related
to Sanity CLI must be Node.js compatible.
