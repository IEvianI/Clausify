import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core"

export const planEnum = pgEnum("plan", ["FREE", "PRO", "BUSINESS"])
export const documentTypeEnum = pgEnum("document_type", [
  "CGV",
  "MENTIONS_LEGALES",
  "POLITIQUE_CONFIDENTIALITE",
  "CGVU",
])

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  refreshToken: text("refresh_token"),
  plan: planEnum("plan").default("FREE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const companies = pgTable("companies", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  sector: text("sector").notNull(),
  activity: text("activity").notNull(),
  email: text("email").notNull(),
  country: text("country").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const documents = pgTable("documents", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  companyId: text("company_id").notNull().references(() => companies.id),
  type: documentTypeEnum("type").notNull(),
  language: text("language").default("fr").notNull(),
  content: text("content").notNull(),
  hasWatermark: boolean("has_watermark").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})