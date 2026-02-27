import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.reports.list.path, async (req, res) => {
    try {
      const r = await storage.getReports();
      res.json(r);
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.reports.get.path, async (req, res) => {
    try {
      const report = await storage.getReport(Number(req.params.id));
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.reports.upload.path, upload.single("report"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = req.file;
      let textContent = "";
      let imageContent = null;

      if (file.mimetype === "application/pdf") {
        const data = await pdfParse(file.buffer);
        textContent = data.text;
      } else if (file.mimetype.startsWith("image/")) {
        imageContent = file.buffer.toString("base64");
      } else {
        return res.status(400).json({ message: "Unsupported file type. Please upload a PDF or Image." });
      }

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: `You are a medical AI assistant. Your task is to analyze medical lab reports.
          Extract the following information and output ONLY valid JSON matching this schema:
          {
            "title": "A short descriptive title (e.g. Complete Blood Count)",
            "summary": "A brief overall summary of the health status (plain language, max 2 sentences)",
            "metrics": {
              "totalTests": <number>,
              "normalTests": <number>,
              "abnormalTests": <number>,
              "abnormalAlerts": [
                { "name": "Test name", "value": "Result value", "expected": "Normal range", "unit": "Unit" }
              ],
              "normalList": [
                { "name": "Test name", "value": "Result value", "unit": "Unit" }
              ]
            },
            "dietRecommendations": ["Suggestion 1", "Suggestion 2"],
            "exerciseRecommendations": ["Exercise 1", "Exercise 2"]
          }
          Provide Indian lifestyle remedies (diet & yoga) where applicable. Provide specific items like Karela juice, Bhujangasana if they match the symptoms.
          Keep it positive, professional, but clear about abnormalities.`
        }
      ];

      if (textContent) {
        messages.push({
          role: "user",
          content: `Here is the text extracted from the lab report:\n\n${textContent}`
        });
      } else if (imageContent) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: "Here is the image of the lab report." },
            { type: "image_url", image_url: { url: `data:${file.mimetype};base64,${imageContent}` } }
          ]
        });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message?.content || "{}");

      const report = await storage.createReport({
        title: result.title || "Lab Report",
        summary: result.summary || "Summary not available.",
        metrics: result.metrics || { totalTests: 0, normalTests: 0, abnormalTests: 0, abnormalAlerts: [], normalList: [] },
        dietRecommendations: result.dietRecommendations || [],
        exerciseRecommendations: result.exerciseRecommendations || [],
      });

      res.status(201).json(report);
    } catch (err) {
      console.error("Error processing report:", err);
      res.status(500).json({ message: "Error processing report" });
    }
  });

  return httpServer;
}

// Ensure database is seeded with a sample
async function seedDatabase() {
  const existingReports = await storage.getReports();
  if (existingReports.length === 0) {
    await storage.createReport({
      title: "Complete Blood Count & Lipids",
      summary: "Your report looks mostly healthy. Blood count is within the normal range, but there are slightly elevated cholesterol levels.",
      metrics: {
        totalTests: 8,
        normalTests: 6,
        abnormalTests: 2,
        abnormalAlerts: [
          { name: "LDL Cholesterol", value: "160", expected: "< 100", unit: "mg/dL" },
          { name: "Triglycerides", value: "155", expected: "< 150", unit: "mg/dL" }
        ],
        normalList: [
          { name: "Hemoglobin", value: "14.5", unit: "g/dL" },
          { name: "WBC Count", value: "6.2", unit: "10^3/uL" },
          { name: "Platelets", value: "250", unit: "10^3/uL" },
          { name: "HDL Cholesterol", value: "45", unit: "mg/dL" },
          { name: "Fasting Blood Sugar", value: "85", unit: "mg/dL" },
          { name: "Vitamin D", value: "35", unit: "ng/mL" }
        ]
      },
      dietRecommendations: [
        "Include more fiber: Oats, Methi (Bitter Gourd)",
        "Reduce saturated fats: Limit ghee and fried foods",
        "Karela juice in the morning"
      ],
      exerciseRecommendations: [
        "Daily 30 min brisk walk",
        "Bhujangasana (Cobra Pose) for core and digestion",
        "Surya Namaskar (Sun Salutation) sequences"
      ]
    });
  }
}

seedDatabase().catch(console.error);
