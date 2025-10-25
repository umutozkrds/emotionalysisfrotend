import axios from "axios";

const API_BASE_URL = "https://emotionanalysischat-5.onrender.com/api";

export interface AnalyzeRequest {
  text: string;
}

export interface EmotionResult {
  label: string;
  score: number;
}

export interface User {
  id: number;
  nickname: string;
  createdAt: string;
}

export interface RegisterRequest {
  nickname: string;
}

class ApiService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 seconds timeout for emotion analysis
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async analyzeEmotion(text: string): Promise<EmotionResult> {
    try {
      const response = await this.axiosInstance.post("/Test/analyze", {
        text: text,
      });

      const data = response.data;
      console.log("Raw response:", data);

      if (typeof data === "string") {
        if (data.includes("event: complete") && data.includes("data: ")) {
          const lines = data.split("\n");
          const dataLine = lines.find((line) => line.startsWith("data: "));
          if (dataLine) {
            const jsonStr = dataLine.replace("data: ", "");
            const parsed = JSON.parse(jsonStr);
            if (Array.isArray(parsed) && parsed[0]) {
              return parsed[0];
            }
          }
        } else {
          const parsed = JSON.parse(data);
          if (parsed.data && parsed.data[0]) {
            return parsed.data[0];
          } else if (Array.isArray(parsed) && parsed[0]) {
            return parsed[0];
          }
        }
      } else if (data.data && data.data[0]) {
        return data.data[0];
      } else if (Array.isArray(data) && data[0]) {
        return data[0];
      }

      throw new Error("Unexpected response format from emotion analysis");
    } catch (error) {
      console.error("Error analyzing emotion:", error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get("/Test");
      return response.status === 200;
    } catch (error) {
      console.error("Error testing connection:", error);
      return false;
    }
  }

  // User Registration Methods
  async registerUser(nickname: string): Promise<User> {
    try {
      const response = await this.axiosInstance.post<User>("/User/register", {
        nickname,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error registering user:", error);
      throw new Error(error.response?.data?.error || "Failed to register user");
    }
  }

  async loginUser(nickname: string): Promise<User> {
    try {
      const response = await this.axiosInstance.get<User>(
        `/User/login/${encodeURIComponent(nickname)}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error logging in user:", error);
      throw new Error(error.response?.data?.error || "Failed to login user");
    }
  }

  async checkNicknameAvailability(nickname: string): Promise<{
    available: boolean;
    nickname: string;
    message: string;
  }> {
    try {
      const response = await this.axiosInstance.get(
        `/User/check-availability/${encodeURIComponent(nickname)}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error checking nickname availability:", error);
      throw new Error("Failed to check nickname availability");
    }
  }

  async getUser(userId: number): Promise<User> {
    try {
      const response = await this.axiosInstance.get<User>(`/User/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error getting user:", error);
      throw new Error(error.response?.data?.error || "Failed to get user");
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.axiosInstance.get<User[]>("/User");
      return response.data;
    } catch (error: any) {
      console.error("Error getting all users:", error);
      throw new Error("Failed to get users");
    }
  }
}

export const apiService = new ApiService();
