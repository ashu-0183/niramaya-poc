import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const api = axios.create({ baseURL: `${BACKEND_URL}/api`, withCredentials: true });

let refreshing = null;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const cfg = error.config;
    const skip = /\/auth\/(login|refresh|logout)/.test(cfg?.url ?? "");
    if (error.response?.status !== 401 || !cfg || cfg._retry || skip) return Promise.reject(error);
    cfg._retry = true;
    try {
      refreshing = refreshing ?? api.post("/auth/refresh");
      await refreshing;
    } catch {
      return Promise.reject(error);
    } finally {
      refreshing = null;
    }
    return api(cfg);
  },
);

export const formatApiError = (detail) => {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  }
  if (typeof detail?.msg === "string") return detail.msg;
  return String(detail);
};

export const fileUrl = (value) =>
  typeof value === "string" && value.startsWith("/api/") ? `${BACKEND_URL}${value}` : value;

export const fetchContent = async () => {
  if (!BACKEND_URL) return null;
  const { data } = await api.get("/content", { timeout: 6000 });
  return data && typeof data === "object" && !Array.isArray(data) ? data : null;
};
