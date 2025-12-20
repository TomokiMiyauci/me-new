import type { DetailedHTMLProps, HTMLAttributes, JSX, ReactNode } from "react";
import { clsx } from "clsx";

interface FooterProps {
  logo: ReactNode;
  navigation?: Navigation[];
  copyright?: string;
}

interface Navigation {
  name: string;
  items: NavigationItem[];
}

interface NavigationItem {
  name: string;
  location: string;
}

export default function Footer(
  props:
    & FooterProps
    & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
): JSX.Element {
  const { logo, navigation, copyright, ...rest } = props;
  const { className, ...restProps } = rest;

  return (
    <footer
      className={clsx(className, "space-y-8 md:space-y-24")}
      {...restProps}
    >
      <div className="sm:grid grid-cols-3">
        <div className="mb-8 col-span-1">{logo}</div>

        <div className="col-span-2 grid gap-8 sm:flex sm:justify-end sm:gap-x-20">
          {navigation?.map((nav) => (
            <nav key={nav.name}>
              <p className="text-md font-medium mb-1">{nav.name}</p>

              <ul>
                {nav.items.map((item) => (
                  <li key={item.name}>
                    <a className="text-sm" href={item.location}>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <p className="text-center">
        {copyright && <small>{copyright}</small>}
      </p>
    </footer>
  );
}
