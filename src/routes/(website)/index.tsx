import { type JSX } from "react";
import resolver, { Entry } from "@/services/link.ts";
import { type AppProps } from "@/services/app.tsx";

export default function Home(props: AppProps): JSX.Element {
  const admin = resolver.resolve(Entry.Admin, {});
  const about = resolver.resolve(Entry.About, { lang: props.lang });

  return (
    <div id="root">
      <div>
        {/* <Button>Label</Button> */}
        <a href={admin ?? undefined}>Admin</a>
        <a href={about ?? undefined}>About</a>

        <a href={resolver.resolve(Entry.Home, { lang: "en" }) ?? undefined}>
          To En
        </a>

        <a href={resolver.resolve(Entry.Home, { lang: "ja" }) ?? undefined}>
          To JA
        </a>
      </div>
    </div>
  );
}
