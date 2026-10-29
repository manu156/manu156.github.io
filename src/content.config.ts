import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const baseSchema = z.object({
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  title: z.string(),
  date: z.coerce.date(),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./content/blog" }),
  schema: z.discriminatedUnion("external", [
    baseSchema.extend({
      external: z.literal(false),
      description: z.string().optional(),
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
    description: z.string().optional(),
  }),
});

export const collections = { blog, projects };
