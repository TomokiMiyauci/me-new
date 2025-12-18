declare module "vite-plugin-rsc-assets-manifest/types" {
  export interface Vite {
    loadManifest(environment: string): Promise<ViteManifest>;
    outDir: {
      resolve(environment: string): string;
    };
  }
}
export interface ViteManifest {
  [k: string]: Metadata;
}

export interface Metadata {
  file: string;
  name: string;
  src?: string;
  isDynamicEntry?: boolean;
  imports?: string[];
  dynamicImports?: string[];
  css?: string[];
}
