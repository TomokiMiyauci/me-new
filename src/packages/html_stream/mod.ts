export interface InjectionOptions {
  mark?: string;
}

export class HTMLInjectionStream extends TransformStream<string, string> {
  constructor(html: string, options?: InjectionOptions) {
    let buffer = "";
    const mark = options?.mark ?? "</head>";

    super({
      transform(chunk, controller): void {
        buffer += chunk;

        const index = buffer.indexOf(mark);
        if (index !== -1) {
          const before = buffer.slice(0, index);
          controller.enqueue(before);
          controller.enqueue(html);
          controller.enqueue(mark);

          buffer = buffer.slice(index + mark.length);
        }
      },

      flush(controller): void {
        if (buffer.length > 0) {
          controller.enqueue(buffer);
        }
      },
    });
  }
}
