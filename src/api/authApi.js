const USERS_KEY = "medsim_users";
const CURRENT_KEY = "medsim_current_user";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId() {
  return "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export const authApi = {
  register: async ({ email, username, password }) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      throw new Error("Пользователь с таким email уже существует");
    }
    const user = {
      id: generateId(),
      email,
      nickname: username,
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    users.push({ ...user, password });
    saveUsers(users);
    const token = "tok_" + generateId();
    localStorage.setItem(CURRENT_KEY, JSON.stringify({ user, token }));
    return { user, access_token: token };
  },

  login: async ({ email, password }) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      throw new Error("Неверный email или пароль");
    }
    const user = { id: found.id, email: found.email, nickname: found.nickname, avatar: found.avatar, createdAt: found.createdAt };
    const token = "tok_" + generateId();
    localStorage.setItem(CURRENT_KEY, JSON.stringify({ user, token }));
    return { user, access_token: token };
  },

  getCurrentUser: async (token) => {
    const stored = JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
    if (stored && stored.token === token) {
      return stored.user;
    }
    throw new Error("Сессия истекла");
  },

  resetPassword: async ({ email, newPassword }) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.email === email);
    if (idx === -1) {
      throw new Error("Пользователь с таким email не найден");
    }
    users[idx].password = newPassword;
    saveUsers(users);
    return { success: true };
  },
};
