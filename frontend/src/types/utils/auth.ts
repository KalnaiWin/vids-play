// utils/auth.ts
export const setAuthFlag = () => localStorage.setItem("is_logged_in", "true");
export const clearAuthFlag = () => localStorage.removeItem("is_logged_in");
export const isLikelyAuthenticated = () => localStorage.getItem("is_logged_in") === "true";