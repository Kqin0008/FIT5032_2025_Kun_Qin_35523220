import { reactive } from 'vue';

export const authState = reactive({
  isAuthenticated: false,
  user: null, // { name, email, role }
});

export function login(user) {
  authState.isAuthenticated = true;
  authState.user = user;
}

export function logout() {
  authState.isAuthenticated = false;
  authState.user = null;
}

export function hasRole(role) {
  return authState.user && authState.user.role === role;
} 