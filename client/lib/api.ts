import axiosClient from "./axios-client"

// API functions
export async function login(email: string, password: string): Promise<{ token: string }> {
  try {
    const response = await axiosClient.post("/api/auth/login", {
      email,
      password
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Login failed");
  }
}

export async function fetchUrlData() {
  try {
    const response = await axiosClient.get("/api/about");
    if (response.status !== 200) {
      throw new Error("Failed to fetch URL data");
    }
    return response.data.urlsData;
  } catch (error) {
    console.error("Error fetching URL data:", error);
    throw new Error("Failed to fetch URL data");
  }
}