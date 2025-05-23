export const API_CONFIG = {
  baseUrl: process.env.API_URL || "https://api.ks.kodekosan.com/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
} as const 