import type { DetailedHTMLProps, HTMLAttributes, JSX } from "react";

interface FooterProps {
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
  const { navigation, copyright, ...rest } = props;

  return (
    <footer {...rest}>
      {navigation?.map((nav) => (
        <nav key={nav.name}>
          <span>{nav.name}</span>

          <ul>
            {nav.items.map((item) => (
              <li key={item.name}>
                <a href={item.location}>{item.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      ))}

      <p>
        {copyright && <small>{copyright}</small>}
      </p>
    </footer>
  );
}
