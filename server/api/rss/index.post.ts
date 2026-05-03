import { z } from "zod";
import Parser from "rss-parser";

const USER_FEED_LIMIT = 10;

const schema = z.object({
  url: z.url(),
});

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

const parser = new Parser();

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = await readValidatedBody(event, schema.parse);

  const userFeedCount = await prisma.userRssFeed.count({
    where: { userId: user.id },
  });

  if (userFeedCount >= USER_FEED_LIMIT) {
    throw createError({
      statusCode: 403,
      statusMessage: `You can subscribe to at most ${USER_FEED_LIMIT} feeds`,
    });
  }

  const normalizedUrl = normalizeUrl(body.url);

  let feed = await prisma.rssFeed.findUnique({ where: { url: normalizedUrl } });

  if (!feed) {
    // title will be updated after the first successful fetch
    feed = await prisma.rssFeed.create({
      data: { url: normalizedUrl, title: "" },
    });
  }

  const feedId = feed.id;

  const alreadySubscribed = await prisma.userRssFeed.findUnique({
    where: { userId_feedId: { userId: user.id, feedId } },
  });

  if (alreadySubscribed) {
    throw createError({
      statusCode: 409,
      statusMessage: "Already subscribed to this feed",
    });
  }

  await prisma.userRssFeed.create({ data: { userId: user.id, feedId } });

  const existingItemCount = await prisma.rssFeedItem.count({
    where: { feedId },
  });

  let feedTitle = feed.title;

  if (existingItemCount === 0) {
    let xml: string;

    try {
      const response = await fetch(normalizedUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; KatoRSS/1.0)" },
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      xml = await response.text();
    } catch (cause) {
      console.error("Failed to fetch RSS feed:", cause);
      throw createError({
        statusCode: 422,
        statusMessage: "Could not fetch the RSS feed",
      });
    }

    type RawItem = {
      title: string;
      link: string;
      pubDate: Date;
      description: string;
    };
    let parsedFeed: Parser.Output<unknown>;

    try {
      parsedFeed = await parser.parseString(xml);
    } catch (cause) {
      console.error("Failed to parse RSS feed:", cause);
      throw createError({
        statusCode: 422,
        statusMessage: "Could not parse the RSS feed",
      });
    }

    feedTitle = stripHtml(String(parsedFeed.title ?? "")).slice(0, 200);

    const rawItems: RawItem[] = (parsedFeed.items ?? [])
      .slice(0, 20)
      .map((item) => {
        const { summary } = item as Record<string, unknown>;

        return {
          title: stripHtml(String(item.title ?? "")).slice(0, 500),
          link: extractLink(item),
          pubDate: parseDate(item.isoDate ?? item.pubDate),
          description: stripHtml(
            String(item.contentSnippet ?? item.content ?? summary ?? ""),
          ).slice(0, 1000),
        };
      });

    if (rawItems.length > 0) {
      await prisma.rssFeedItem.createMany({
        data: rawItems.map((item) => ({ feedId, ...item })),
      });
    }

    await prisma.rssFeed.update({
      where: { id: feedId },
      data: { title: feedTitle, lastFetchedAt: new Date() },
    });
  }

  const items = await prisma.rssFeedItem.findMany({
    where: { feedId },
    orderBy: { pubDate: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      link: true,
      pubDate: true,
      description: true,
    },
  });

  return { id: feedId, url: feed.url, title: feedTitle, items };
});
