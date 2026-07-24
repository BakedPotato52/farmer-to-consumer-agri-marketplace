import { store, generateId } from "@/lib/data/store";
import type { User, UserRole } from "@/lib/types";
import { saveUserToFirestore, fetchUsersFromFirestore } from "@/lib/firebase/services";

export async function getAllUsers(): Promise<User[]> {
  const users = await fetchUsersFromFirestore();
  return users.length > 0 ? users : store.users;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getAllUsers();
  return users.find((u) => u.email === email);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getAllUsers();
  return users.find((u) => u.id === id);
}

export async function createUser(
  data: Omit<User, "id" | "createdAt" | "updatedAt">,
): Promise<User> {
  const now = new Date().toISOString();
  const newUser: User = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  store.users.push(newUser);
  await saveUserToFirestore(newUser);
  return newUser;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const users = await getAllUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  return user || null;
}

export async function getUsersByRole(role: UserRole): Promise<User[]> {
  const users = await getAllUsers();
  return users.filter((u) => u.role === role);
}
