export const IS_DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";

export const DEV_USER = {
  id: "dev_001",
  email: "dev@medsim.local",
  nickname: "Разработчик",
  avatar: null,
  createdAt: new Date().toISOString(),
};
