import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const baseSchema = z.object({
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string().default("General"),
  tags: z.array(z.string()).default([]),
  series: z
    .object({
      name: z.string(),
      part: z.number(),
    })
    .optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./content/blog" }),
  schema: z.discriminatedUnion("external", [
    baseSchema.extend({
      external: z.literal(false),
      ogImagePath: z.string().optional(),
      canonicalUrl: z.string().optional(),
    }),
    baseSchema.extend({
      external: z.literal(true),
      url: z.string(),
    }),
  ]),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./content/projects" }),
  schema: baseSchema.extend({
    url: z.string(),
  }),
});

export const collections = { blog, projects };
