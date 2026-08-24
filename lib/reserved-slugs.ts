const RESERVED_SLUGS = [
  "admin", "api", "login", "register", "dashboard", "settings", "pricing",
  "features", "templates", "about", "contact", "privacy", "terms",
  "resources", "help", "support", "demo", "docs", "blog", "careers",
  "holocard", "root", "system", "app", "www", "mail", "ftp",
];

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}
