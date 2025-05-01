import { mockUsers } from "../mock-data"
import type { AuthState, User } from "./atoms"

// Simulated API delay
const apiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Login function
export const login = async (email: string, password: string): Promise<AuthState> => {
  // Simulate API call
  await apiDelay(800)

  // Find user with matching credentials
  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Create user object without password
  const { password: _, ...userWithoutPassword } = user

  return {
    user: userWithoutPassword as User,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  }
}

// Logout function
export const logout = async (): Promise<AuthState> => {
  // Simulate API call
  await apiDelay(500)

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }
}

// Register function (mock)
export const register = async (userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  organization: string
}): Promise<AuthState> => {
  // Simulate API call
  await apiDelay(1000)

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email.toLowerCase() === userData.email.toLowerCase())

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Create new user (in a real app, this would be saved to a database)
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    organization: userData.organization,
    role: "user",
    jobTitle: "New User",
    avatar: "/avatars/default-avatar.png",
  }

  return {
    user: newUser,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  }
}

// Get current user function
export const getCurrentUser = async (): Promise<User | null> => {
  // In a real app, this would validate the token with the server
  await apiDelay(300)

  // Get user from localStorage (this is just for the mock implementation)
  const authData = localStorage.getItem("cybershield_auth")
  if (!authData) return null

  try {
    const parsedData = JSON.parse(authData)
    return parsedData.user
  } catch (error) {
    return null
  }
}

// Update user profile
export const updateUserProfile = async (userId: string, profileData: Partial<User>): Promise<User> => {
  // Simulate API call
  await apiDelay(1000)

  // Get current user
  const authData = localStorage.getItem("cybershield_auth")
  if (!authData) throw new Error("User not found")

  try {
    const parsedData = JSON.parse(authData)
    const currentUser = parsedData.user

    if (!currentUser || currentUser.id !== userId) {
      throw new Error("Unauthorized")
    }

    // Update user data
    const updatedUser = {
      ...currentUser,
      ...profileData,
    }

    return updatedUser
  } catch (error) {
    throw new Error("Failed to update profile")
  }
}
