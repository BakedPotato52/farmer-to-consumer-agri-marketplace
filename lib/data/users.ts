import { store, generateId } from "@/lib/data/store";
import type { User, UserRole } from "@/lib/types";
import { saveUserToFirestore } from "@/lib/firebase/services";

export function getUserByEmail(email: string): User | undefined {
  return store.users.find((u) => u.email === email);
}

export function getUserById(id: string): User | undefined {
  return store.users.find((u) => u.id === id);
}

export function createUser(
  data: Omit<User, "id" | "createdAt" | "updatedAt">,
): User {
  const now = new Date().toISOString();
  const newUser: User = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  store.users.push(newUser);
  saveUserToFirestore(newUser).catch(console.error);
  return newUser;
}

export function authenticateUser(email: string, password: string): User | null {
  const user = store.users.find(
    (u) => u.email === email && u.password === password,
  );
  return user || null;
}

export function getAllUsers(): User[] {
  return [...store.users];
}

export function getUsersByRole(role: UserRole): User[] {
  return store.users.filter((u) => u.role === role);
}
