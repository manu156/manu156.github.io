import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");

  const sortedPosts = posts
    .filter((p) => p.data.draft !== true)
    .sort(
      (a, b) =>
        new Date(b.data.date).valueOf() -
        new Date(a.data.date).valueOf()
    );

  const rssItems = sortedPosts.map((post) => {
    if (post.data.external) {
      return {
        title: post.data.title,
        pubDate: post.data.date,
        link: post.data.url,
      };
    }

    return {
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.id}`,
    };
  });

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: rssItems,
  });
}
