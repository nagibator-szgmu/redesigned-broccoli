export const EMPTY_USER = {
  id: null,
  email: null,
  nickname: null,
  avatar: null,
  createdAt: null,
};

export const AUTH_STATUS = {
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

/**
 * @param {string} id
 * @param {string} email
 * @param {string} nickname
 */
export function createUser(id, email, nickname) {
  return {
    id,
    email,
    nickname,
    avatar: null,
    createdAt: new Date().toISOString(),
  };
}
