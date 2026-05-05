import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import dsarRoutes from "./server/routes/dsarRoutes";
import metricsRoutes from "./server/routes/metricsRoutes";
import alertRoutes from "./server/routes/alertRoutes";
import auditRoutes from "./server/routes/auditRoutes";
import { errorHandler } from "./server/middleware/errorMiddleware";
import { CronService } from "./server/services/cronService";
import { analyzePrivacyRequest } from "./src/services/aiAnalysisService";
import { AuditLogService } from "./server/services/auditLogService";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/dsars", dsarRoutes);
  app.use("/api/metrics", metricsRoutes);
  app.use("/api/alerts", alertRoutes);
  app.use("/api/audit", auditRoutes);

  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { requestData } = req.body;
      const result = await analyzePrivacyRequest(requestData);
      await AuditLogService.log('AI_ANALYSIS', 'PrivacyRequest', requestData.id, `Risk: ${result.riskLevel}`);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'AI Analysis failed' });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are an expert Privacy Operations assistant. Help users navigate GDPR, CCPA, and handle DSAR requests. Be professional, concise, and technical."
        }
      });

      const result = await chat.sendMessage({ message });
      res.json({ text: result.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Chat failed' });
    }
  });

  // Error Handling (must be after routes)
  app.use(errorHandler);

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Start Background Tasks
    CronService.start();
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
