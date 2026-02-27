import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useReports() {
  return useQuery({
    queryKey: [api.reports.list.path],
    queryFn: async () => {
      const res = await fetch(api.reports.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      return parseWithLogging(api.reports.list.responses[200], data, "reports.list");
    },
  });
}

export function useReport(id: number) {
  return useQuery({
    queryKey: [api.reports.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.reports.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch report");
      const data = await res.json();
      return parseWithLogging(api.reports.get.responses[200], data, `reports.get(${id})`);
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useUploadReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Intentionally not using application/json so browser sets multipart boundary
      const res = await fetch(api.reports.upload.path, {
        method: api.reports.upload.method,
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        let errorMsg = "Failed to upload report";
        try {
          const errData = await res.json();
          errorMsg = errData.message || errorMsg;
        } catch (e) {
          // Ignore json parse error
        }
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      return parseWithLogging(api.reports.upload.responses[201], data, "reports.upload");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
    },
  });
}
