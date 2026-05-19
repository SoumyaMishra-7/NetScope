import axios from "axios";
import { packets, protocolDistribution, trafficSeries } from "../data/mockData";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 6000,
});

function mockResponse(data, delay = 350) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve({ data }), delay);
  });
}

export async function getPackets(params = {}) {
  try {
    return await api.get("/packets", { params });
  } catch {
    return mockResponse({ packets, source: "mock" });
  }
}

export async function getAnalytics() {
  try {
    return await api.get("/analytics");
  } catch {
    return mockResponse({
      activeDevices: 284,
      networkHealth: 96,
      packetLoss: 0.7,
      activeConnections: 12482,
      systemLatency: 42,
      threatDetections: 17,
      protocolDistribution,
      trafficSeries,
      source: "mock",
    });
  }
}

export async function getPacketById(id) {
  try {
    return await api.get(`/packets/${id}`);
  } catch {
    return mockResponse({ packet: packets.find((packet) => packet.id === id) || packets[0], source: "mock" });
  }
}

export async function uploadLogs(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    return await api.post("/logs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch {
    return mockResponse({
      fileName: file.name,
      parsedRows: 1280,
      suspiciousActivity: 23,
      failedRequests: 61,
      riskScore: 74,
      source: "mock",
    }, 700);
  }
}

export default api;
