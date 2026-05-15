import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { Locale } from "@/i18n/config";
import siteSettings from "../../content/settings/general.json";
import aboutContent from "../../content/about/about.json";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type SiteSettings = typeof siteSettings;
export type AboutContent = typeof aboutContent;

export function getSiteSettings(): SiteSettings {
  return siteSettings;
}

export function getAboutContent(locale: Locale) {
  return aboutContent[locale];
}

export interface ServiceFrontmatter {
  title: string;
  slug: string;
  order?: number;
  excerpt: string;
  icon?: string;
  coverImage?: string;
  features?: string[];
  faq?: { q: string; a: string }[];
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author?: string;
  tags?: string[];
  coverImage?: string;
  readTime?: number;
}

export interface ProjectFrontmatter {
  title: string;
  slug: string;
  location: string;
  year: number;
  serviceType: string;
  depth?: string;
  diameter?: string;
  piles?: number;
  duration?: string;
  client?: string;
  coverImage?: string;
  gallery?: string[];
  summary: string;
}

export interface ContentItem<T> {
  frontmatter: T;
  html: string;
  raw: string;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const file = await remark().use(remarkGfm).use(remarkHtml).process(markdown);
  return String(file);
}

function readMarkdownDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

async function readMarkdownFile<T>(filePath: string): Promise<ContentItem<T>> {
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  const html = await markdownToHtml(content);
  return {
    frontmatter: data as T,
    html,
    raw: content,
  };
}

export async function getServices(
  locale: Locale,
): Promise<ContentItem<ServiceFrontmatter>[]> {
  const dir = path.join(CONTENT_ROOT, "services", locale);
  const files = readMarkdownDir(dir);
  const items = await Promise.all(
    files.map((f) =>
      readMarkdownFile<ServiceFrontmatter>(path.join(dir, f)),
    ),
  );
  return items.sort(
    (a, b) =>
      (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99),
  );
}

export async function getService(
  locale: Locale,
  slug: string,
): Promise<ContentItem<ServiceFrontmatter> | null> {
  const services = await getServices(locale);
  return services.find((s) => s.frontmatter.slug === slug) ?? null;
}

export async function getArticles(
  locale: Locale,
): Promise<ContentItem<ArticleFrontmatter>[]> {
  const dir = path.join(CONTENT_ROOT, "articles", locale);
  const files = readMarkdownDir(dir);
  const items = await Promise.all(
    files.map((f) =>
      readMarkdownFile<ArticleFrontmatter>(path.join(dir, f)),
    ),
  );
  return items.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );
}

export async function getArticle(
  locale: Locale,
  slug: string,
): Promise<ContentItem<ArticleFrontmatter> | null> {
  const articles = await getArticles(locale);
  return articles.find((a) => a.frontmatter.slug === slug) ?? null;
}

export async function getProjects(
  locale: Locale,
): Promise<ContentItem<ProjectFrontmatter>[]> {
  const dir = path.join(CONTENT_ROOT, "projects", locale);
  const files = readMarkdownDir(dir);
  const items = await Promise.all(
    files.map((f) =>
      readMarkdownFile<ProjectFrontmatter>(path.join(dir, f)),
    ),
  );
  return items.sort((a, b) => b.frontmatter.year - a.frontmatter.year);
}

export async function getProject(
  locale: Locale,
  slug: string,
): Promise<ContentItem<ProjectFrontmatter> | null> {
  const projects = await getProjects(locale);
  return projects.find((p) => p.frontmatter.slug === slug) ?? null;
}
