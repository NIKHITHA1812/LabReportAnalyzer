import { z } from 'zod';
import { insertReportSchema, reports } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  reports: {
    list: {
      method: 'GET' as const,
      path: '/api/reports' as const,
      responses: {
        200: z.array(z.custom<typeof reports.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/reports/:id' as const,
      responses: {
        200: z.custom<typeof reports.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    // The upload endpoint accepts FormData with a 'report' file field
    upload: {
      method: 'POST' as const,
      path: '/api/reports/upload' as const,
      responses: {
        201: z.custom<typeof reports.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ReportResponse = z.infer<typeof api.reports.get.responses[200]>;
export type ReportsListResponse = z.infer<typeof api.reports.list.responses[200]>;
