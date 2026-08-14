import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import {
  generateOpenApiDocument,
  createOpenApiExpressMiddleware,
} from "trpc-to-openapi";

import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

import cookieParser from "cookie-parser";

export const app = express();

const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Streamyst OpenAPI",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

if (env.NODE_ENV !== "prod") {
  const allowedOrigins = [
    env.WEB_URL,
    "http://localhost:3007",
    "http://192.168.56.1:3007",
  ].filter((value): value is string => Boolean(value));

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );
}

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    message: "Streamyst is up and running...",
  });
});

app.get("/health", (req, res) => {
  return res.json({
    message: "Streamyst server is healthy",
    healthy: true,
  });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);

app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);

app.use(
  "/docs",
  apiReference({
    url: "/openapi.json",
  }),
);

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;