/**
 * MEMORY REHAB LAB - LAYER 35 POLYMORPHIC OS SWARM & EPHEMERAL MICRO-SANDBOX GATEWAY
 * Endpoint: /api/os-swarm
 */

import { swarmOsMatrix } from "../src/services/swarmOsMatrix.js";
import { getClientIp, enforceWaf, handleCors, applySecurityHeaders } from "./_security.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  applySecurityHeaders(res);

  if (!enforceWaf(req, res)) return;

  const clientIp = getClientIp(req);
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  // Subpath routing: /api/os-swarm/[action]
  const parts = pathname.split("/").filter(Boolean);
  // parts e.g. ["api", "os-swarm", "status"] or ["api", "os-swarm", "source", "rust", "lib.rs"]
  const osIndex = parts.indexOf("os-swarm");
  const action = osIndex !== -1 && parts[osIndex + 1] ? parts[osIndex + 1] : (url.searchParams.get("action") || req.body?.action || "status");

  try {
    if (req.method === "GET") {
      if (action === "status") {
        return res.status(200).json(swarmOsMatrix.getTelemetry());
      }

      if (action === "artifacts") {
        return res.status(200).json(swarmOsMatrix.getArtifactInventory());
      }

      if (action === "source") {
        // /api/os-swarm/source/:category/:filename or ?category=rust&filename=lib.rs
        const category = parts[osIndex + 2] || url.searchParams.get("category");
        const filename = parts[osIndex + 3] || url.searchParams.get("filename");

        const source = swarmOsMatrix.getSourceCode(category, filename);
        if (!source) {
          return res.status(404).json({ error: "Source artifact not found or prohibited" });
        }
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        return res.status(200).send(source.source);
      }
    }

    if (req.method === "POST") {
      const body = req.body || {};

      if (action === "spawn") {
        const { profile } = body;
        const result = swarmOsMatrix.spawnHandle(profile, clientIp);
        return res.status(201).json(result);
      }

      if (action === "dispatch") {
        const { command } = body;
        if (typeof command !== "string") {
          return res.status(400).json({ error: "Invalid command: string expected" });
        }
        const result = swarmOsMatrix.dispatchCommand(command, clientIp);
        return res.status(200).json(result);
      }

      if (action === "detonate") {
        const { hexOpcodes } = body;
        if (hexOpcodes !== undefined && typeof hexOpcodes !== "string") {
          return res.status(400).json({ error: "Invalid hexOpcodes: string expected" });
        }
        const result = swarmOsMatrix.detonateCrossSwarm(hexOpcodes || "4831c0c3", clientIp);
        return res.status(200).json(result);
      }

      if (action === "rotate") {
        const result = swarmOsMatrix.rotateSwarm();
        return res.status(200).json(result);
      }
    }

    return res.status(400).json({ error: "Unknown os-swarm action or unsupported method" });
  } catch (err) {
    return res.status(500).json({ error: "OS_SWARM_GATEWAY_ERROR", message: err.message });
  }
}
