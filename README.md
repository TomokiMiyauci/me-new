# me

My personal website.

## Overview

This application provides:

🌐 RSC(React Server Components)

🗂 CMS-driven content

🌍 Multi-language support(en, ja)

### Tech Stack

- Runtime: Deno
- Builder: Vite
- HTML Renderer: React
- Styling: Tailwind CSS
- Data Source: GraphQL
- CICD: Runtime Environment
- Hosting: Deno Deploy

## Getting Started

### Requirements

Deno >= 2

### Installation

Clone the repository and install dependencies:

```bash
deno install
```

### Development

Start the development server:

```bash
deno task dev
```

### Build

Build the application for production:

```bash
deno task build
```

### Preview

Preview the production build locally:

```bash
deno task preview
```

### Available Tasks

Check all available tasks:

```bash
deno task
```

## Environment Variables

See [.env.example](./.env.example) for required environment variables.

## License

[MIT](./license)
