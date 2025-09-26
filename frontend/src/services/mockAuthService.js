// // mockAuthService.js
// export async function login(email, password) {
//   console.warn("Mock login called — no Firebase");
//   return { user: { email, uid: "mock-uid" } };
// }

// export async function register(email, password) {
//   console.warn("Mock register called — no Firebase");
//   return { user: { email, uid: "mock-uid" } };
// }

// export async function logout() {
//   console.warn("Mock logout called — no Firebase");
//   return true;
// }

// export function onAuthStateChangedMock(callback) {
//   console.warn("Mock onAuthStateChanged — always logged out");
//   callback(null);
// }



// mockAuthService.js

// Simulated "database"
let mockUser = null;

export const login = async (email, password) => {
  console.log("Mock login", email, password);
  mockUser = { id: 'mock-uid', email, firstName: 'John', lastName: 'Doe', role: 'user' };
  return { user: mockUser };
};

export const register = async (email, password, firstName, lastName) => {
  console.log("Mock register", email, password, firstName, lastName);
  mockUser = { id: 'mock-uid', email, firstName, lastName, role: 'user' };
  return { user: mockUser };
};

export const logout = async () => {
  console.log("Mock logout");
  mockUser = null;
  return true;
};

export const onAuthStateChanged = (callback) => {
  console.log("Mock onAuthStateChanged");
  callback(mockUser);
};

const USERS_KEY = "mock_users";
const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY)) || [];
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const mockAuthService = {
  register: (email, password) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error("User already exists");
    }
    users.push({ email, password });
    saveUsers(users);
    return { user: { email } };
  },

  login: (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid credentials");
    localStorage.setItem("mock_user", JSON.stringify(user));
    return { user };
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("mock_user"));
  },

  logout: () => {
    localStorage.removeItem("mock_user");
  }
};
