import { black, blue, cyan } from "chalk";
import { createWriteStream, readFile, existsSync, writeFile } from "fs-extra";
import { resolve } from "path";
import { SitemapStream } from "sitemap";

import type { App, Page, PageData } from "@vuepress/core";
import type {
  SitemapFrontmatterOption,
  SitemapLinkOption,
  SitemapImageOption,
  SitemapVideoOption,
  SitemapOptions,
} from "./types";

interface SitemapOption {
  lastmod: string;
  changefreq?: string;
  priority?: number;
  img?: SitemapImageOption[];
  video?: SitemapVideoOption[];
  alternateLinks?: SitemapLinkOption[];
}

const stripLocalePrefix = (
  page: Page
): {
  /** path of '/' */
  defaultPath: string;
  /** Locale path prefix of the page */
  pathLocale: string;
} => ({
  defaultPath: page.path.replace(page.pathLocale, "/"),
  pathLocale: page.pathLocale,
});

const generatePageMap = (
  options: SitemapOptions,
  app: App
): Map<string, SitemapOption> => {
  const {
    changefreq = "daily",
    exclude = [],
    dateFormatter = (page: PageData & { lastUpdatedTime?: number }): string =>
      page.lastUpdatedTime ? new Date(page.lastUpdatedTime).toISOString() : "",
  } = options;

  const {
    pages,
    options: { base, locales },
  } = app;

  const pageLocalesMap = pages.reduce(
    (map: Map<string, string[]>, page) => {
      const { defaultPath, pathLocale } = stripLocalePrefix(page);
      const pathLocales = map.get(defaultPath) || [];
      pathLocales.push(pathLocale);

      return map.set(defaultPath, pathLocales);
    },
    // a map with keys of defaultPath and string[] value with pathLocales
    new Map()
  );

  const pagesMap = new Map<string, SitemapOption>();

  pages.forEach((page) => {
    const frontmatterOptions: SitemapFrontmatterOption =
      (page.frontmatter.sitemap as SitemapFrontmatterOption) || {};

    const metaRobotTags = (page.frontmatter.head || []).find(
      (head) => head[1].name === "robots"
    );

    const excludePage = metaRobotTags
      ? ((metaRobotTags[1].content as string) || "")
          .split(/,/u)
          .map((content) => content.trim())
          .includes("noindex")
      : frontmatterOptions.exclude;

    if (excludePage) exclude.push(page.path);

    const lastmodifyTime = dateFormatter(page);
    const { defaultPath } = stripLocalePrefix(page);
    const relatedLocales = pageLocalesMap.get(defaultPath) || [];

    let alternateLinks: SitemapLinkOption[] = [];

    if (relatedLocales.length > 1)
      alternateLinks = relatedLocales.map((localePrefix) => ({
        lang: locales[localePrefix].lang || "en",
        url: `${base}${defaultPath.replace(/^\//u, localePrefix)}`,
      }));

    pagesMap.set(page.path, {
      alternateLinks,
      changefreq: changefreq,
      lastmod: lastmodifyTime,
      ...frontmatterOptions,
    });
  });

  return pagesMap;
};

export const genSiteMap = async (
  options: SitemapOptions,
  app: App
): Promise<void> => {
  console.log(
    blue("Sitemap:"),
    black.bgYellow("wait"),
    "Generating sitemap..."
  );

  const { urls = [], xslUrl, exclude = [], xmlNameSpace: xmlns } = options;
  const hostname = options.hostname.replace(/\/$/u, "");
  const outFile = options.outFile
    ? options.outFile.replace(/^\//u, "")
    : "sitemap.xml";
  const {
    options: { base, dest },
  } = app;

  const sitemap = new SitemapStream({
    hostname,
    xslUrl,
    xmlns,
  });
  const sitemapXMLPath = resolve(dest, outFile);
  const writeStream = createWriteStream(sitemapXMLPath);

  sitemap.pipe(writeStream);

  const pagesMap = generatePageMap(options, app);

  pagesMap.forEach((page, path) => {
    if (!exclude.includes(path))
      sitemap.write({ url: `${base}${path}`, ...page });
  });

  urls.forEach((item) => sitemap.write(item));
  sitemap.end();
  console.log(
    blue("Sitemap:"),
    black.bgGreen("Success"),
    `Sitemap generated and saved to ${cyan(outFile)}`
  );

  const robotTxtPath = resolve(dest, "robots.txt");
  const robotsTxt = existsSync(robotTxtPath)
    ? await readFile(robotTxtPath, { encoding: "utf8" })
    : "";

  const newRobotsTxtContent = `${robotsTxt.replace(
    /^Sitemap: .*$/u,
    ""
  )}\nSitemap: ${hostname}${base}${outFile}\n`;

  await writeFile(robotTxtPath, newRobotsTxtContent, { flag: "w" });

  console.log(
    blue("Sitemap:"),
    black.bgGreen("Success"),
    `Appended sitemap path to ${cyan("robots.txt")}`
  );
};
