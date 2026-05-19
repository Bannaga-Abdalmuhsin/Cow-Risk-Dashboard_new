import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { logger } from "./lib/logger.js";
import router from "./routes/index.js";

const __dirnameEsm = dirname(fileURLToPath(import.meta.url));
const dashboardDist = join(__dirnameEsm, "../../hajj-dashboard/dist/public");

const app = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", router);

if (process.env.NODE_ENV === "production" && existsSync(dashboardDist)) {
  app.use(express.static(dashboardDist));
  app.get(/.*/, (_req, res) => {
    res.sendFile(join(dashboardDist, "index.html"));
  });
}

export default app;
