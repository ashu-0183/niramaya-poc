import { useEffect, useState } from "react";
import { api } from "@/content/api";

export const useAdminAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let alive = true;
    api
      .get("/auth/me")
      .then((res) => {
        if (alive) setUser(res.data);
      })
      .catch(() => {
        if (alive) setUser(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(false);
    }
  };

  return { user, setUser, login, logout };
};
