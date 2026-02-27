import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  metrics: jsonb("metrics").notNull().$type<{
    totalTests: number;
    normalTests: number;
    abnormalTests: number;
    abnormalAlerts: Array<{ name: string; value: string; expected: string; unit: string }>;
    normalList: Array<{ name: string; value: string; unit: string }>;
  }>(),
  dietRecommendations: jsonb("diet_recommendations").notNull().$type<string[]>(),
  exerciseRecommendations: jsonb("exercise_recommendations").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).omit({ id: true, createdAt: true });

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
