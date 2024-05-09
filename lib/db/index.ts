import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// export const UserAPILimitTable = pgTable("user_api_limit", {
//   id: serial("id").primaryKey(),
//   user_id: text("userId").notNull().unique(),
//   limit: integer("limit").notNull(),
//   used: integer("used").notNull(),
//   stripeCustomerId: text("stripeCustomerId").notNull().unique(),
// });

// export const UserSubscriptionTable = pgTable("user_subscription", {
//   id: serial("id").primaryKey(),
//   user_id: text("userId").notNull().unique(),
//   stripeCustomerId: text("stripeCustomerId").notNull().unique(),
//   stripePriceId: text("stripePriceId").unique(),
//   stripeSubscriptionId: text("stripeSubscriptionId").notNull().unique(),
//   stripeCurrentPeriodEnd: timestamp("stripeCurrentPeriodEnd"),
// });

export const SettingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  user_id: text("userId").notNull(),
  imap: text("imap").notNull(),
  email: text("email").notNull(),
  api_key: text("apiKey").notNull(),
  projects: text("projects").notNull(),
});

export type Settings = typeof SettingsTable.$inferSelect;
// Connect to Vercel Postgres
export const db = drizzle(sql);
