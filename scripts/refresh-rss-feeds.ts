/**
 * Refreshes stale RSS feeds and keeps only the latest items per feed.
 */

import "dotenv/config";
import { PrismaClient } from "../shared/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Parser from "rss-parser";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const parser = new Parser();

const STALE_FEED_HOURS = 6;
const MAX_ITEMS_PER_FEED = 20;

const normalizeUrl = (raw: string): string => {
  const parsed = new URL(raw.trim());
  const path = parsed.pathname.replace(/\/$/, "");

  return `${parsed.protocol}//${parsed.host}${path}`.toLowerCase();
};

const stripHtml = (html: string): string =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, String.fromCharCode(34))
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseDate = (raw: unknown): Date => {
  if (!raw) return new Date();
  const d = new Date(String(raw).trim());

  return isNaN(d.getTime()) ? new Date() : d;
};

const asText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const getObjectHref = (value: unknown): string => {
  if (!value || typeof value !== "object") return "";

  const record = value as Record<string, unknown>;
  const direct = asText(record.href) || asText(record["@_href"]);

  if (direct.length > 0) return direct;

  const attrs = record.$ as Record<string, unknown> | undefined;

  return asText(attrs?.href);
};

const getObjectValue = (value: unknown): string => {
  if (!value || typeof value !== "object") return "";

  const record = value as Record<string, unknown>;

  return asText(record["#text"]) || asText(record._) || asText(record.value);
};

const extractLink = (item: Parser.Item): string => {
  const direct = asText(item.link);

  if (direct.length > 0) return direct;

  const record = item as Record<string, unknown>;

  const fromLinkObject = getObjectHref(record.link);

  if (fromLinkObject.length > 0) return fromLinkObject;

  const atomLink = record["atom:link"];

  if (Array.isArray(atomLink)) {
    const alternate = atomLink.find((entry) => {
      const obj = entry as Record<string, unknown>;
      const rel =
        asText(obj.rel) ||
        asText((obj.$ as Record<string, unknown> | undefined)?.rel);

      return rel.length === 0 || rel === "alternate";
    });

    const fromAlternate = getObjectHref(alternate);

    if (fromAlternate.length > 0) return fromAlternate;

    const fromFirst = getObjectHref(atomLink[0]);

    if (fromFirst.length > 0) return fromFirst;
  } else {
    const fromAtom = getObjectHref(atomLink);

    if (fromAtom.length > 0) return fromAtom;
  }

  const { enclosure } = record;

  if (Array.isArray(enclosure)) {
    const fromEnclosureArray = enclosure
      .map((entry) => {
        const obj = entry as Record<string, unknown>;

        return (
          asText(obj.url) ||
          asText((obj.$ as Record<string, unknown> | undefined)?.url)
        );
      })
      .find((url) => url.length > 0);

    if (fromEnclosureArray) return fromEnclosureArray;
  } else if (enclosure && typeof enclosure === "object") {
    const obj = enclosure as Record<string, unknown>;
    const fromEnclosure =
      asText(obj.url) ||
      asText((obj.$ as Record<string, unknown> | undefined)?.url);

    if (fromEnclosure.length > 0) return fromEnclosure;
  }

  return (
    asText(record.id) ||
    getObjectValue(record.id) ||
    asText(record.guid) ||
    getObjectValue(record.guid)
  );
};

const itemKey = (item: {
  link: string;
  title: string;
  pubDate: Date;
}): string => {
  const link = item.link.trim();

  if (link.length > 0) {
    return `link:${link}`;
  }

  return `title:${item.title}|date:${item.pubDate.toISOString()}`;
};

const refreshFeed = async (feed: { id: string; url: string }) => {
  const normalizedUrl = normalizeUrl(feed.url);

  let parsedFeed: Parser.Output<unknown>;

  try {
    parsedFeed = await parser.parseURL(normalizedUrl);
  } catch (cause) {
    console.error(`Failed to parse feed ${normalizedUrl}:`, cause);

    return;
  }

  const existingItems = await prisma.rssFeedItem.findMany({
    where: { feedId: feed.id },
    select: {
      link: true,
      title: true,
      pubDate: true,
    },
  });

  const existingKeys = new Set(existingItems.map(itemKey));

  const parsedItems = (parsedFeed.items ?? []).slice(0, 80).map((item) => {
    const record = item as Record<string, unknown>;

    return {
      title: stripHtml(String(item.title ?? "")).slice(0, 500),
      link: extractLink(item),
      pubDate: parseDate(item.isoDate ?? item.pubDate),
      description: stripHtml(
        String(item.contentSnippet ?? item.content ?? record.summary ?? ""),
      ).slice(0, 1000),
    };
  });

  const newItems = parsedItems
    .filter((item) => {
      const key = itemKey(item);

      if (existingKeys.has(key)) {
        return false;
      }

      existingKeys.add(key);

      return true;
    })
    .map((item) => ({ feedId: feed.id, ...item }));

  if (newItems.length > 0) {
    await prisma.rssFeedItem.createMany({
      data: newItems,
    });
  }

  const sortedItems = await prisma.rssFeedItem.findMany({
    where: { feedId: feed.id },
    orderBy: [{ pubDate: "desc" }, { createdAt: "desc" }],
    select: { id: true },
  });

  const oldItemIds = sortedItems
    .slice(MAX_ITEMS_PER_FEED)
    .map((item) => item.id);

  if (oldItemIds.length > 0) {
    await prisma.rssFeedItem.deleteMany({
      where: { id: { in: oldItemIds } },
    });
  }

  await prisma.rssFeed.update({
    where: { id: feed.id },
    data: {
      title: stripHtml(String(parsedFeed.title ?? "")).slice(0, 200),
      lastFetchedAt: new Date(),
    },
  });

  console.log(
    `Refreshed ${normalizedUrl}: +${newItems.length} new, -${oldItemIds.length} old`,
  );
};

const main = async () => {
  const staleBefore = new Date(Date.now() - STALE_FEED_HOURS * 60 * 60 * 1000);

  const staleFeeds = await prisma.rssFeed.findMany({
    where: {
      userRssFeeds: { some: {} },
      OR: [{ lastFetchedAt: null }, { lastFetchedAt: { lt: staleBefore } }],
    },
    select: {
      id: true,
      url: true,
    },
  });

  console.log(`Found ${staleFeeds.length} stale feeds to refresh.`);

  for (const feed of staleFeeds) {
    await refreshFeed(feed);
  }

  await prisma.$disconnect();
};

main().catch(async (cause) => {
  console.error(cause);
  await prisma.$disconnect();
  process.exit(1);
});
