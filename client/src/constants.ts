export const BACKEND_BASE =
  process.env.NODE_ENV === "production"
    ? "https://fierce-dawn-00927.herokuapp.com"
    : "http://localhost:8501";
