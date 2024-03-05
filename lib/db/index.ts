import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const UserAPILimitTable = pgTable("user_api_limit", {
  id: serial("id").primaryKey(),
  user_id: text("userId").notNull().unique(),
  limit: integer("limit").notNull(),
  used: integer("used").notNull(),
});

export const UserSubscriptionTable = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  user_id: text("userId").notNull().unique(),
  stripeCustomerId: text("stripeCustomerId").notNull().unique(),
  stripeSubscriptionId: text("stripeSubscriptionId").notNull().unique(),
  stripePriceId: text("stripePriceId").unique(),
  stripeCurrentPeriodEnd: timestamp("stripeCurrentPeriodEnd"),
});

export const SummaryTable = pgTable("summary", {
  id: text("id").primaryKey(),
  user_id: text("userId").notNull(),
  summary: text("summary").notNull(),
  link: text("link").notNull(),
  image: text("image"),
  title: text("title").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Connect to Vercel Postgres
export const db = drizzle(sql);
