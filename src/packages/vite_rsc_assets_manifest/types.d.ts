declare global {
  interface ImportMeta {
    vite: Vite;
  }
}

export interface Vite {
  rsc: {
    loadManifest(environment: string): Promise<ViteAssetsManifest>;
  };
}

interface ViteAssetsManifest {
  bootstrapScriptContent: string;
  clientReferenceDeps: Record<string, ResourceMap>;
  serverResources: Record<string, ResourceMap>;
}

interface ResourceMap {
  js: string[];
  css: string[];
}

export {};
