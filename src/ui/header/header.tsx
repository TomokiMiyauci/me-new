import type { JSX, ReactNode } from "react";

export interface HeaderProps {
  logo: ReactNode;
  translations?: Translation[];
}

export interface Translation {
  location: string;
  label: string;
  lang: string;
}

export default function Header(props: HeaderProps): JSX.Element {
  const { logo, translations } = props;
  return (
    <header className="px-4 py-6">
      {logo}

      {translations && (
        <nav>
          {translations.map((translation) => {
            const { label, lang, location } = translation;

            return (
              <li key={lang}>
                <a href={location}>
                  {label}
                </a>
              </li>
            );
          })}
        </nav>
      )}
    </header>
  );
}
