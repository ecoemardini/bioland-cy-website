// Content collections — the same fields the editor (/admin) writes.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const url = z.string().url().refine((u) => u.startsWith('https://'), 'Use an https:// address');

// News and events are one collection (coordinator, 10 Nov 2026). An entry is a news post unless `type` says otherwise.
// For an event or workshop, `date` is the day it takes place; past and upcoming are worked out from it.
const news = defineCollection({
  loader: glob({
    base: './src/content/news',
    pattern: '*/index.md',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      type: z.enum(['news', 'event', 'workshop']).default('news'),
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string().optional(),
      cover: image().optional(),
      cover_alt: z.string().optional(),
      // event details (ignored for news posts)
      time: z.string().regex(/^\d{1,2}:\d{2}$/, 'Use HH:MM, e.g. 10:00').optional(),
      end_date: z.coerce.date().optional(),
      location: z.string().optional(),
      format: z.enum(['in-person', 'online', 'hybrid']).optional(),
      registration_url: url.optional(),
      materials: z.array(z.object({ label: z.string(), file: z.string() })).default([]),
      social_url: url.optional(),
      draft: z.boolean().default(false),
    }),
});

const deliverables = defineCollection({
  loader: glob({ base: './src/content/deliverables', pattern: '*.json' }),
  schema: z.object({
    code: z.string(),
    title: z.string(),
    summary: z.string().optional(),
    wp: z.enum(['WP1', 'WP2', 'WP3', 'WP4', 'WP5']),
    due_month: z.coerce.number().int().min(1).max(36),
    status: z.enum(['planned', 'in-progress', 'submitted', 'published']).default('planned'),
    public: z.boolean().default(true),
    pdf: z.string().optional(),
    doi: z.string().optional(),
  }),
});

const team = defineCollection({
  loader: glob({ base: './src/content/team', pattern: '*.json' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      order: z.coerce.number().default(10),
      photo: image().optional(),
      bio: z.string().optional(),
      email: z.string().email().optional(),
      orcid: z.string().optional(),
      linkedin: url.optional(),
    }),
});

export const collections = { news, deliverables, team };
