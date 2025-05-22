export const API_CONFIG = {
  baseUrl: process.env.API_URL || "http://localhost:3000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
} as const 