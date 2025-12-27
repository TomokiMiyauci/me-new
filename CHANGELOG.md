# [1.8.0](https://github.com/TomokiMiyauci/me-new/compare/1.7.0...1.8.0) (2025-12-27)


### Bug Fixes

* change default status to 404 if entry is not found ([f966316](https://github.com/TomokiMiyauci/me-new/commit/f96631684266e40d30fcd33599420c3d4db6be53))
* specify lang as query ([eb511ba](https://github.com/TomokiMiyauci/me-new/commit/eb511baa8e3ce1df4eb01de075335258b0c064a2))


### Features

* add breadcrumbs ([5fb06fe](https://github.com/TomokiMiyauci/me-new/commit/5fb06fefbf78d38c55b5f9e0825cd494b09d1e50))
* add list of contents ([53b0ca1](https://github.com/TomokiMiyauci/me-new/commit/53b0ca15378d399e1a715a101fc46724a9d90e99))
* add picture fragment, remove image ([b6d64cb](https://github.com/TomokiMiyauci/me-new/commit/b6d64cb061421a0182c8e8d367aa7c6527211d22))
* add privacy policy page ([fc45188](https://github.com/TomokiMiyauci/me-new/commit/fc45188dff26e540ff3acc3b777c0f7913f605ef))
* add redirect handler ([8b88078](https://github.com/TomokiMiyauci/me-new/commit/8b8807843ced5b1efb3905bdf4448cc050c015f1))
* add title and description to posts entry ([ed046b2](https://github.com/TomokiMiyauci/me-new/commit/ed046b20716a62665edf3569330390284dbe3c3f))
* change article summary design ([961dc29](https://github.com/TomokiMiyauci/me-new/commit/961dc29a90ff231bcbf8ffaffce5f9f92cd5a254))
* **graphql-client:** add graphql client lib ([3fc8b8f](https://github.com/TomokiMiyauci/me-new/commit/3fc8b8f1b80be62bbe5c5c5b1e3a9acb1c2d91b8))
* improve error page view ([9378e76](https://github.com/TomokiMiyauci/me-new/commit/9378e76624193f1d7b07b57c9bcab9968fead597))
* improve not found page style ([3df0f1b](https://github.com/TomokiMiyauci/me-new/commit/3df0f1bb9056fd7cc3cd49213a75c40bd560f5ba))
* **packages:** add declarative csp package ([25c0e81](https://github.com/TomokiMiyauci/me-new/commit/25c0e8188b53b60100aa9eb2aa5532e3370164f8))
* **react-meta:** add react meta lib ([f2bb9e3](https://github.com/TomokiMiyauci/me-new/commit/f2bb9e3b36e009e2a2d41190505818ff86973f8d))
* **router/redirection:** add router middleware for redirection rule ([711c0ab](https://github.com/TomokiMiyauci/me-new/commit/711c0ababc6852935293c68174b626ff4b8805b8))
* **router:** add router middleware endpoint ([c98a017](https://github.com/TomokiMiyauci/me-new/commit/c98a017914b215d3b5c170e26a0e687b911cd0de))
* **router:** change csp middleware interface ([2f10b3c](https://github.com/TomokiMiyauci/me-new/commit/2f10b3c63a2d4aa98940e48eb8b85b7128b2670b))
* **web-cache:** add cache impl for web api ([5e846ce](https://github.com/TomokiMiyauci/me-new/commit/5e846ce7066a756470f2e3efebae3da9340db8cf))

# [1.7.0](https://github.com/TomokiMiyauci/me-new/compare/1.6.0...1.7.0) (2025-12-22)


### Bug Fixes

* fix to use dispose hook ([15eae16](https://github.com/TomokiMiyauci/me-new/commit/15eae16391ffe68b565816a000bd5e34037cff29))


### Features

* add alternative links to each components ([1a27ebf](https://github.com/TomokiMiyauci/me-new/commit/1a27ebf293e2f0186e9d4ef611f7f96299cfe510))
* add daisy ui and icons ([5f642c1](https://github.com/TomokiMiyauci/me-new/commit/5f642c16c28025de6afc1a4fd5a31b38f7b074ab))
* add ld json ([b1b34e3](https://github.com/TomokiMiyauci/me-new/commit/b1b34e3eb24bd365adcb708ed326677742da9462))
* add sanity client ([890b965](https://github.com/TomokiMiyauci/me-new/commit/890b9653123b66d950bffeff9cd456447b31c063))
* add tailwind as deps ([cef3235](https://github.com/TomokiMiyauci/me-new/commit/cef323519015f3b3cf04cf92148ec932859a055a))
* add translation link to layout ([ffd5c18](https://github.com/TomokiMiyauci/me-new/commit/ffd5c18a428f34645867bdba9c942b9a9bddf27f))
* add url field to app props ([28aed64](https://github.com/TomokiMiyauci/me-new/commit/28aed6464ab713b8b17625d5d47814a5e7ee4857))
* change content data source, change query ([92e932b](https://github.com/TomokiMiyauci/me-new/commit/92e932b0571319d11a353433b593b442c7673acc))
* query cover image and render it ([2eaf82e](https://github.com/TomokiMiyauci/me-new/commit/2eaf82ef3a5af94ba12373e142f804124af63e03))
* render ogp meta tags ([34c2c14](https://github.com/TomokiMiyauci/me-new/commit/34c2c1420b36d481b323787f3aa772446cb17c09))
* **ui:** add footer storybook ([ce54870](https://github.com/TomokiMiyauci/me-new/commit/ce54870f349728370130aeed7345d329b35d8363))
* use urql instead of graphql-request ([002c999](https://github.com/TomokiMiyauci/me-new/commit/002c999753d8cda16a2269705aaeac4d06947826))

# [1.6.0](https://github.com/TomokiMiyauci/me-new/compare/1.5.0...1.6.0) (2025-12-16)


### Bug Fixes

* add escape for url pattern ([b708aef](https://github.com/TomokiMiyauci/me-new/commit/b708aef16538e78e1f974898ac6f82d410f7e4ad))
* change resolveId id to unique ([c41c9ec](https://github.com/TomokiMiyauci/me-new/commit/c41c9ec68bbdc9496e8a63669518ed54dea27ea8))
* create i18n instance for each request ([e425da0](https://github.com/TomokiMiyauci/me-new/commit/e425da0a1f53f59cd90727302ff59b849db35cbe))
* fix browser entry typo ([4973eb0](https://github.com/TomokiMiyauci/me-new/commit/4973eb01b205711e9b775b85a399d21d77c5b1b7))
* remove root level suspense ([73a6ce0](https://github.com/TomokiMiyauci/me-new/commit/73a6ce005352e1559a4548b15cd2d086c3f435ee))
* remove to refer module info ([6e18333](https://github.com/TomokiMiyauci/me-new/commit/6e183337f02c494942b570945e678934721676aa))
* **vite-plugin-deno:** fix typo ([d8d6a62](https://github.com/TomokiMiyauci/me-new/commit/d8d6a621e5a37f3e75d0d1f4de54ee33455d4234))


### Features

* add app-router lib ([e8c1d93](https://github.com/TomokiMiyauci/me-new/commit/e8c1d9361066e32611d4f69659b7007ccf8db54c))
* add build deps, change server side artifact to unboundle ([caf54e7](https://github.com/TomokiMiyauci/me-new/commit/caf54e779adf1897c014a19fc9d6b6ceb3088635))
* add deps ([add1a74](https://github.com/TomokiMiyauci/me-new/commit/add1a740647e933a8cb9ea87cfaadb10accf6e15))
* add global error component ([3107508](https://github.com/TomokiMiyauci/me-new/commit/310750884413b2f6a5c28cfcec830cc0103af610))
* add i18n field to app props ([4333e22](https://github.com/TomokiMiyauci/me-new/commit/4333e22e29d79e14af5ac4b60c4c05dff0c0e8e3))
* add not found boundary to react-app ([462bf20](https://github.com/TomokiMiyauci/me-new/commit/462bf20ecb160bd2681cf36219515cb58f02526a))
* add NotFound function to react app ([317d19c](https://github.com/TomokiMiyauci/me-new/commit/317d19cce96b10d2a908eaa1a6be6ca038d7114e))
* add posts and post page ([f12080f](https://github.com/TomokiMiyauci/me-new/commit/f12080f07694e782e481f2bb2706a572adc89cb2))
* add pubsub module for browser entry ([2c8b89f](https://github.com/TomokiMiyauci/me-new/commit/2c8b89f3a2e3fb9990133f00ae7e328b80ae8e33))
* add route-lit lib ([8a7e0d3](https://github.com/TomokiMiyauci/me-new/commit/8a7e0d3051834684ee3c09d030d0d7cc59c8704e))
* add vite plugin for deno ([4b71b54](https://github.com/TomokiMiyauci/me-new/commit/4b71b5491db5ab6e3c40c29c65f6c296a724f647))
* change app props to accept current entry ([14047cc](https://github.com/TomokiMiyauci/me-new/commit/14047cc728a5502eb11b52699274198b86746539))
* change csp policy for sanity studio ([1e567fc](https://github.com/TomokiMiyauci/me-new/commit/1e567fcee68d7b0967ca6fd2e90e6296b922efdf))
* change return value interface, rename data to error ([2f3a546](https://github.com/TomokiMiyauci/me-new/commit/2f3a546608e3cab98fc2106364c5bc5b397eb5ea))
* extend app props ([a21044b](https://github.com/TomokiMiyauci/me-new/commit/a21044b9498f531118413734defd01fab43245d6))
* init i18next, use it ([d19a416](https://github.com/TomokiMiyauci/me-new/commit/d19a4163c1081bc6385901390b1901dabe2c1d04))
* **react-app:** add not found shell component ([c3d5df8](https://github.com/TomokiMiyauci/me-new/commit/c3d5df86bc9941cc18f3558a1e96a33a3b91567b))
* **react-app:** export html shell component ([7a2020e](https://github.com/TomokiMiyauci/me-new/commit/7a2020e8b360c48a45244c1c0124c7ccae62d39a))
* **react-router:** change route component field to function ([4a54f07](https://github.com/TomokiMiyauci/me-new/commit/4a54f07ad6cabbe0044417f594e4aa869e929934))
* remove all sanity related code ([9101ffc](https://github.com/TomokiMiyauci/me-new/commit/9101ffc3850f601c1c3be0e936636b6fc120bf55))
* **rsc-protocol:** add rsc stream utility ([6a9e7df](https://github.com/TomokiMiyauci/me-new/commit/6a9e7dfb77797f9d0688f34e2316f406c998e622))
* update deps ([3524628](https://github.com/TomokiMiyauci/me-new/commit/3524628fcabf289760cc2cc25863c493c2b408ef))
* use entry resolver for internal localized pathname ([dcecdc1](https://github.com/TomokiMiyauci/me-new/commit/dcecdc1a2130f6fce866dfe1b832d62fa1766dd6))
* use Navigation API instead of History API ([9235f98](https://github.com/TomokiMiyauci/me-new/commit/9235f98403448f2ade0c97dc83d118d4814af20a))


### Performance Improvements

* add manual chunk per package ([12f4924](https://github.com/TomokiMiyauci/me-new/commit/12f4924d7ac71dfd4eb76a458a7a076793bdb1c2))

# [1.5.0](https://github.com/TomokiMiyauci/me-new/compare/1.4.0...1.5.0) (2025-11-25)


### Bug Fixes

* fix to typo of header field ([35802b6](https://github.com/TomokiMiyauci/me-new/commit/35802b6ee47e752696fd629512de6432ef543a6a))


### Features

* add deps ([36d7361](https://github.com/TomokiMiyauci/me-new/commit/36d73610428ca34585a33d1c2ee9611a9c6a63ae))
* add html csp middleware ([bf03d85](https://github.com/TomokiMiyauci/me-new/commit/bf03d855998cef2778ab86a5ff5134e69abfee55))
* change content security policy ([d2229b5](https://github.com/TomokiMiyauci/me-new/commit/d2229b587cfb7747f6ab86b04b2005703c6e479d))
* change router interface to accept context ([5e1866c](https://github.com/TomokiMiyauci/me-new/commit/5e1866cc1f16dd967a50a9c94ad43978a870fd14))
* improve csp interface to accept csp directives ([cc9932b](https://github.com/TomokiMiyauci/me-new/commit/cc9932b0017dbd0b8551ae46bdf84a4998d81510))

# [1.4.0](https://github.com/TomokiMiyauci/me-new/compare/1.3.0...1.4.0) (2025-11-24)


### Bug Fixes

* fix to extract client manifest ([d6837f2](https://github.com/TomokiMiyauci/me-new/commit/d6837f26e0390777a89b92ff460ab8e0cf6cf91d))


### Features

* add app as service ([cf5f707](https://github.com/TomokiMiyauci/me-new/commit/cf5f707753d2aaec9639d315e6dea8e88825d94d))
* add error boundary and handle ssr error ([0987d95](https://github.com/TomokiMiyauci/me-new/commit/0987d9554f5e8bc689d082c8a6f1da5929f1c065))
* add is not found error like function ([7076d63](https://github.com/TomokiMiyauci/me-new/commit/7076d63d35dd464cbeac5aaae378a9935bebf3a1))
* add key to error boundary ([0c9e844](https://github.com/TomokiMiyauci/me-new/commit/0c9e844d6ae683fbe36b8e7be1ff153ac8306447))
* add not found protocol, change rsc streaming error handling ([dace182](https://github.com/TomokiMiyauci/me-new/commit/dace1828ce62a716bb40fcaca7597985115dd428))
* add react-error-boundary ([c629103](https://github.com/TomokiMiyauci/me-new/commit/c6291032a51953a93109814b27acd81a282545f9))
* add server error component ([a1468b1](https://github.com/TomokiMiyauci/me-new/commit/a1468b1cc735e463e6f8c99d41dc1e3135240ade))
* change error boundary props ([07c322e](https://github.com/TomokiMiyauci/me-new/commit/07c322effaab5729ec4f92b7b71b939e04906513))
* change error boundary props ([200aac4](https://github.com/TomokiMiyauci/me-new/commit/200aac4e86e1039c20a8a66bec01f65fade48a2b))

# [1.3.0](https://github.com/TomokiMiyauci/me-new/compare/1.2.0...1.3.0) (2025-11-17)


### Features

* add embeded sanity studio ([d17c23b](https://github.com/TomokiMiyauci/me-new/commit/d17c23bcaed8c23f4458bd604c963fbf2cb822ae))
* add node polyfills and polyfill Buffer object ([12c4ead](https://github.com/TomokiMiyauci/me-new/commit/12c4ead7db997c1e0217e1a94d620f6799402ad1))

# [1.2.0](https://github.com/TomokiMiyauci/me-new/compare/1.1.0...1.2.0) (2025-11-17)

### Features

- add runtime config to project
  ([1109073](https://github.com/TomokiMiyauci/me-new/commit/11090731cbf987030b3dd4fffaa2666a3e878e5f))
- add sentry to project
  ([db4082a](https://github.com/TomokiMiyauci/me-new/commit/db4082a2bf1037b649c11ef49b129624e799ad4e))
- add vite plugin for reference of build artifact
  ([64d4dfe](https://github.com/TomokiMiyauci/me-new/commit/64d4dfeb1a9c32ff52dc4f25c38e1f505728976f))
- change build env prefix, rename env
  ([f0a50af](https://github.com/TomokiMiyauci/me-new/commit/f0a50af62000497bd275ec919d538516faecf4d9))
- change import meta namespace to vite from viteRsc
  ([3076354](https://github.com/TomokiMiyauci/me-new/commit/307635472de26d4c44126b4310a68dbce4bdf0ad))
- export sanity studio
  ([2655fa0](https://github.com/TomokiMiyauci/me-new/commit/2655fa0518e649dba74b08a4800b01fce98b0f19))
- **lib:** add deno env mock
  ([4559030](https://github.com/TomokiMiyauci/me-new/commit/4559030369a983cbcaeb45ecca1b7824a4f3458e))
- use vite as middleware
  ([4365136](https://github.com/TomokiMiyauci/me-new/commit/43651360c1a703aa263ec06d994680c2acb2cc86))

# [1.1.0](https://github.com/TomokiMiyauci/my-blog/compare/v1.0.0...1.1.0) (2025-11-11)

### Features

- change tag format
  ([0ae1ca5](https://github.com/TomokiMiyauci/my-blog/commit/0ae1ca522eff6462c2945510cf26047aa8111af5))

# 1.0.0 (2025-11-11)

### Features

- add env utility
  ([b001f6d](https://github.com/TomokiMiyauci/my-blog/commit/b001f6dd5ffccef2133c24dfe8f13fcd2e99a008))
- add framework
  ([eb6cd33](https://github.com/TomokiMiyauci/my-blog/commit/eb6cd33ef44df246a1e67b29fc980ad022bc4c83))
- add http router
  ([3fba87d](https://github.com/TomokiMiyauci/my-blog/commit/3fba87df5c0c4ec0877bb281626621b330fd1e7d))
- add i18n config
  ([fa2fb44](https://github.com/TomokiMiyauci/my-blog/commit/fa2fb4427cd23f97c0c1b7d35a3b4f260a24a790))
- add react router
  ([b012580](https://github.com/TomokiMiyauci/my-blog/commit/b0125802b976922b1db44ffc31e6df268923ee16))
- add routes
  ([a6d6911](https://github.com/TomokiMiyauci/my-blog/commit/a6d6911f51373f4fde1abd3487b499ad94471f99))
- add sanity
  ([fdbbbd9](https://github.com/TomokiMiyauci/my-blog/commit/fdbbbd96df102cfaa0e22a84435c44869211a0d2))
- add sanity studio for rsc
  ([dc2405b](https://github.com/TomokiMiyauci/my-blog/commit/dc2405b250c8cdc2333d3eb3b5c378d0368263b2))
- add server entrypoint
  ([af224ac](https://github.com/TomokiMiyauci/my-blog/commit/af224acf86e7d4f8763f9d4888c4f20c61680e5a))
- add vite plugin
  ([e1becb8](https://github.com/TomokiMiyauci/my-blog/commit/e1becb807d7010394b9b1063425188585dce3d0b))
