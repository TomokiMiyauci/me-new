/**
 * Mock for Deno.env
 */
export class DenoEnv implements Deno.Env {
  #map: Map<string, string>;
  constructor(init?: [string, string][]) {
    this.#map = new Map(init);
  }

  get(key: string): string | undefined {
    return this.#map.get(key);
  }

  set(key: string, value: string): void {
    this.#map.set(key, value);
  }

  has(key: string): boolean {
    return this.#map.has(key);
  }

  delete(key: string): void {
    this.#map.delete(key);
  }

  toObject(): { [index: string]: string } {
    return Object.fromEntries(this.#map);
  }
}
