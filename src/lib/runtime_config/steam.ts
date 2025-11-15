export class ScriptJsonSource {
  constructor(public id: string = "shared-store") {
  }

  provide(data: string): string {
    return `<script type="application/json" id="${this.id}">${data}</script>`;
  }

  consume(): string {
    const elements = Array.from(document.querySelectorAll(`#${this.id}`));

    for (const el of elements) {
      const type = el.getAttribute("type");

      if (type === "application/json") {
        const data = el.innerHTML;

        return data;
      }
    }

    throw new Error();
  }
}
