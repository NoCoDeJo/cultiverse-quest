import { Link } from "./types";

interface LinksListProps {
  links: Link[];
}

export const LinksList = ({ links }: LinksListProps) => (
  <div className="space-y-2">
    {links.map((link, index) => (
      <a
        key={index}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3 rounded border border-cultGlow/20 hover:border-cultGlow hover:bg-cultPurple/20 transition-all text-cultWhite"
      >
        {link.title}
      </a>
    ))}
  </div>
);