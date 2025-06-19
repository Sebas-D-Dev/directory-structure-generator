import { create } from 'zustand';

// Define the shape of a single user in the presence list.
// The name and avatarSeed are provided by the backend for consistency.
interface User {
  id: string; // The user's unique connection ID from Ably
  name: string;
  avatarSeed: string;
}

// Define the interface for our application's state and the actions to modify it.
interface AppState {
  // State for the directory editor
  directoryText: string;
  setDirectoryText: (text: string) => void;

  // State for managing users in the workspace
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
}

/**
 * Creates the Zustand store for the application.
 * This store is a single source of truth for our client-side state.
 */
export const useAppStore = create<AppState>((set) => ({
  // --- Directory State ---
  directoryText: 'project-root/\n  - loading...',
  /**
   * Sets the entire content of the directory editor.
   * This is typically used when first loading a workspace or after a full resync.
   * @param {string} text The new text content for the directory structure.
   */
  setDirectoryText: (text: string) => set({ directoryText: text }),


  // --- User Presence State ---
  users: [],
  /**
   * Replaces the entire list of users.
   * Useful for initializing or resetting the presence list from an Ably sync.
   * @param {User[]} users The new array of users.
   */
  setUsers: (users: User[]) => set({ users: users }),

  /**
   * Adds a new user to the presence list, ensuring no duplicates.
   * @param {User} newUser The new user to add.
   */
  addUser: (newUser: User) =>
    set((state) => {
      // Avoid adding a user if they are already in the list
      if (state.users.some((user) => user.id === newUser.id)) {
        return state;
      }
      return { users: [...state.users, newUser] };
    }),

  /**
   * Removes a user from the presence list by their ID.
   * @param {string} userId The ID of the user to remove.
   */
  removeUser: (userId: string) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    })),
}));
