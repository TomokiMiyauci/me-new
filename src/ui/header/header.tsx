import type { DetailedHTMLProps, HTMLAttributes, JSX, ReactNode } from "react";
import { MdGTranslate } from "react-icons/md";
import clsx from "clsx";

export interface HeaderProps {
  logo: ReactNode;
  translation?: Translation;
  lang: string;
}

export interface Translation {
  title: string;
  items: TranslationItem[];
}

export interface TranslationItem {
  location: string;
  label: string;
  lang: string;
}

export default function Header(
  props:
    & HeaderProps
    & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
): JSX.Element {
  const { logo, translation, lang: currentLang, ...rest } = props;
  const { className, ...restProps } = rest;
  return (
    <header
      className={clsx(className, "py-4 justify-between flex items-center")}
      {...restProps}
    >
      {logo}

      <div>
        {translation && (
          <button
            type="button"
            className="btn"
            popoverTarget="popover-1"
            style={{ anchorName: "--anchor-1" }}
          >
            <MdGTranslate size={24} />
          </button>
        )}

        {translation && !!translation.items.length &&
          (
            <nav
              className="mt-2 dropdown menu w-52 rounded-box bg-base-300 shadow-sm dropdown-end"
              popover="auto"
              id="popover-1"
              style={{
                positionAnchor: "--anchor-1",
              }}
            >
              <p className="menu-title">{translation.title}</p>
              <ul>
                {translation.items.map((translation) => {
                  const { label, lang, location } = translation;

                  return (
                    <li key={lang}>
                      <a
                        className={clsx(currentLang === lang && "menu-active")}
                        href={location}
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
      </div>
    </header>
  );
}
