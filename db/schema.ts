import {
  pgTable,
  pgEnum,
  serial,
  integer,
  bigint,
  text,
  boolean,
  timestamp,
  uuid,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Enums ----------

export const roleEnum = pgEnum("role", ["admin", "editor"]);
export const submissionKindEnum = pgEnum("submission_kind", [
  "contact",
  "teklif",
]);
export const postStatusEnum = pgEnum("post_status", ["draft", "published"]);

// ---------- JSONB tipleri (lib/content.ts şekilleriyle birebir) ----------

export type TrainingSection = { title: string; intro: string; bullets: string[] };
export type FaqItem = { q: string; a: string };
export type FormatItem = { label: string; value: string };
export type MetaItem = { label: string; value: string };
export type NoteSegment = { title: string; desc: string };
export type GalleryItem = { src: string; caption: string };
export type FeedbackItem = { quote: string; person: string };

// ---------- Auth ----------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("editor"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const sessions = pgTable("sessions", {
  // Cookie'deki ham token'ın sha256 hex hash'i — DB dökümü session çalmaya yetmez
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- Eğitim kataloğu ----------

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  icon: text("icon").notNull(),
  tagline: text("tagline").notNull(),
  summary: text("summary").notNull(),
  forWhom: jsonb("for_whom").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const trainings = pgTable(
  "trainings",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    // Slug'lar yalnızca kategori içinde benzersiz — aynı slug birden çok kategoride var
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    blurb: text("blurb").notNull(),
    sortOrder: integer("sort_order").notNull(),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("trainings_category_slug_unique").on(t.categoryId, t.slug),
    index("trainings_category_idx").on(t.categoryId),
  ]
);

export const trainingPages = pgTable("training_pages", {
  trainingId: integer("training_id")
    .primaryKey()
    .references(() => trainings.id, { onDelete: "cascade" }),
  seoTitle: text("seo_title").notNull(),
  seoDescription: text("seo_description").notNull(),
  heroQuote: text("hero_quote").notNull(),
  audience: text("audience").notNull(),
  intro: jsonb("intro").$type<string[]>().notNull().default([]),
  sections: jsonb("sections").$type<TrainingSection[]>().notNull().default([]),
  outcomes: jsonb("outcomes").$type<string[]>().notNull().default([]),
  format: jsonb("format").$type<FormatItem[]>().notNull().default([]),
  faq: jsonb("faq").$type<FaqItem[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ---------- Blog ----------

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  body: text("body").notNull(), // markdown
  coverImage: text("cover_image"),
  status: postStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  authorId: uuid("author_id").references(() => users.id, {
    onDelete: "set null",
  }),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ---------- Ekip & Referanslar ----------

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  roleTitle: text("role_title").notNull(),
  bio: text("bio").notNull(),
  photo: text("photo"),
  initials: text("initials"),
  sortOrder: integer("sort_order").notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// "references" SQL anahtar kelimesi olduğu için tablo adı reference_logos
export const referenceLogos = pgTable("reference_logos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  src: text("src").notNull(),
  sortOrder: integer("sort_order").notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ---------- Eğitim notları ----------

export const brandNotes = pgTable("brand_notes", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  company: text("company").notNull(),
  logo: text("logo"),
  title: text("title").notNull(),
  // "Mart 2025" gibi görüntü metni — gerçek tarih değil
  eventDateLabel: text("event_date_label"),
  meta: jsonb("meta").$type<MetaItem[]>().notNull().default([]),
  intro: text("intro"),
  segments: jsonb("segments").$type<NoteSegment[]>().notNull().default([]),
  notes: jsonb("notes").$type<string[]>().notNull().default([]),
  gallery: jsonb("gallery").$type<GalleryItem[]>().notNull().default([]),
  instructorNote: text("instructor_note"),
  feedback: jsonb("feedback").$type<FeedbackItem[]>().notNull().default([]),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const brandNoteMaterials = pgTable(
  "brand_note_materials",
  {
    id: serial("id").primaryKey(),
    brandNoteId: integer("brand_note_id")
      .notNull()
      .references(() => brandNotes.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    // Boş string = dosya henüz yüklenmedi (UI pasif gösterir)
    filePath: text("file_path").notNull().default(""),
    sizeBytes: bigint("size_bytes", { mode: "number" }),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("materials_note_idx").on(t.brandNoteId)]
);

export const accessCodes = pgTable(
  "access_codes",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(), // uppercase-normalize edilmiş
    brandNoteId: integer("brand_note_id")
      .notNull()
      .references(() => brandNotes.id, { onDelete: "cascade" }),
    active: boolean("active").notNull().default(true),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("access_codes_note_idx").on(t.brandNoteId)]
);

export const noteComments = pgTable(
  "note_comments",
  {
    id: serial("id").primaryKey(),
    brandNoteId: integer("brand_note_id")
      .notNull()
      .references(() => brandNotes.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    initials: text("initials"),
    body: text("body").notNull(),
    approved: boolean("approved").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("note_comments_note_idx").on(t.brandNoteId, t.approved)]
);

// ---------- Ayarlar & yasal sayfalar ----------

// Genel amaçlı anahtar-değer ayar deposu (SMTP, çerez banner'ı, özel kodlar,
// form-yasal onay eşlemesi...). Değerler JSONB; şekil doğrulaması uygulama
// katmanında (zod) yapılır.
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const legalPages = pgTable("legal_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  // Düz metin: boş satır = paragraf ayracı, tek satır boşluğu korunur
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ---------- Teklif / iletişim başvuruları ----------

export const submissions = pgTable(
  "submissions",
  {
    id: serial("id").primaryKey(),
    kind: submissionKindEnum("kind").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message"),
    trainingId: integer("training_id").references(() => trainings.id, {
      onDelete: "set null",
    }),
    pagePath: text("page_path"),
    handled: boolean("handled").notNull().default(false),
    handledBy: uuid("handled_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("submissions_created_idx").on(t.createdAt)]
);

// ---------- Relations ----------

export const categoriesRelations = relations(categories, ({ many }) => ({
  trainings: many(trainings),
}));

export const trainingsRelations = relations(trainings, ({ one }) => ({
  category: one(categories, {
    fields: [trainings.categoryId],
    references: [categories.id],
  }),
  page: one(trainingPages, {
    fields: [trainings.id],
    references: [trainingPages.trainingId],
  }),
}));

export const trainingPagesRelations = relations(trainingPages, ({ one }) => ({
  training: one(trainings, {
    fields: [trainingPages.trainingId],
    references: [trainings.id],
  }),
}));

export const brandNotesRelations = relations(brandNotes, ({ many }) => ({
  materials: many(brandNoteMaterials),
  codes: many(accessCodes),
  comments: many(noteComments),
}));

export const brandNoteMaterialsRelations = relations(
  brandNoteMaterials,
  ({ one }) => ({
    note: one(brandNotes, {
      fields: [brandNoteMaterials.brandNoteId],
      references: [brandNotes.id],
    }),
  })
);

export const accessCodesRelations = relations(accessCodes, ({ one }) => ({
  note: one(brandNotes, {
    fields: [accessCodes.brandNoteId],
    references: [brandNotes.id],
  }),
}));

export const noteCommentsRelations = relations(noteComments, ({ one }) => ({
  note: one(brandNotes, {
    fields: [noteComments.brandNoteId],
    references: [brandNotes.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
