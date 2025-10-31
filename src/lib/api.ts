// API configuration and utilities
// API configuration and utilities
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log("🔍 API_BASE_URL =", API_BASE_URL);

export const getChallengeById = (id: string) => apiClient.getChallengeById(id);

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Auth interfaces
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  xp: number;
  level: number;
  rank?: number;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    challengeProgress: number;
    achievements: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}




export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Challenge interfaces
export interface Stage {
  id: string;
  title: string;
  description: string;
  order: number;
  latitude: number;
  longitude: number;
  radius: number;
  qrCode?: string;
  isActive: boolean;
}
export interface CreateStageRequest {
  order: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  radius?: number; // optional, backend default = 50
  qrCode?: string; // optional, for QR code verification
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
  category: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  xpReward: number;
  startDate: string; // ISO format date string (datetime)
  endDate: string; // ISO format date string (datetime) - REQUIRED
  maxParticipants?: number; // optional
  stages: CreateStageRequest[];
}
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  xpReward: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxParticipants?: number;
  createdAt: string;
  updatedAt: string;
  stages: Stage[];
  _count: {
    progress: number;
  };
  userProgress?: ChallengeProgress;
}

export interface ChallengeProgress {
  id: string;
  userId: string;
  challengeId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  startedAt: string;
  completedAt?: string;
  stages: StageProgress[];
  challenge?: Challenge;
}

export interface StageProgress {
  id: string;
  stageId: string;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  completedAt?: string;
  latitude?: number;
  longitude?: number;
  stage: Stage;
}

export interface JoinChallengeRequest {
  challengeId: string;
}

export interface SubmitStageRequest {
  stageId: string;
  latitude: number;
  longitude: number;
  submissionType: 'TEXT' | 'IMAGE' | 'LOCATION' | 'QR_CODE';
  content?: string;
}

// Leaderboard interfaces
export interface LeaderboardEntry {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  xp: number;
  level: number;
  rank: number;
  completedChallenges: number;
  achievements: number;
}

export interface LeaderboardData {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';
  leaderboard: LeaderboardEntry[];
  total: number;
}

export interface LeaderboardStats {
  totalUsers: number;
  totalChallenges: number;
  totalXP: number;
  topUser?: {
    username: string;
    xp: number;
    level: number;
  };
  averageXP: number;
}

// Category interfaces
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

// API client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
   const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(options.headers as Record<string, string>),
};

if (this.token) {
  headers['Authorization'] = `Bearer ${this.token}`;
}

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }



  

  // Auth methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      this.setToken(response.data.token);
    }

    return response.data!;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data) {
      this.setToken(response.data.token);
    }

    return response.data!;
  }

  async getProfile(): Promise<User> {
    const response = await this.request<User>('/auth/profile');
    return response.data!;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    return response.data!;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Challenge methods
  async getChallenges(filters?: {
    category?: string;
    difficulty?: string;
    status?: 'active' | 'upcoming' | 'completed' | 'all';
    limit?: number;
    offset?: number;
  }): Promise<{ challenges: Challenge[]; pagination: PaginationInfo }> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const endpoint = `/challenges${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.request<{ challenges: Challenge[]; pagination: PaginationInfo }>(endpoint);
    return response.data!;
  }

  async getChallengeById(id: string): Promise<Challenge> {
    const response = await this.request<Challenge>(`/challenges/${id}`);
    return response.data!;
  }

  async joinChallenge(challengeId: string): Promise<ChallengeProgress> {
    const response = await this.request<ChallengeProgress>('/challenges/join', {
      method: 'POST',
      body: JSON.stringify({ challengeId }),
    });

    return response.data!;
  }


  async createChallenge(data: CreateChallengeRequest): Promise<Challenge> {
  if (!this.token) {
    throw new Error("❌ Unauthorized: You must be logged in to create a challenge");
  }

  const response = await this.request<Challenge>('/challenges', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.data!;
}


  async submitStage(data: SubmitStageRequest): Promise<StageProgress> {
    const response = await this.request<StageProgress>('/challenges/submit-stage', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.data!;
  }

  async getUserChallenges(status?: 'ACTIVE' | 'COMPLETED' | 'ABANDONED'): Promise<ChallengeProgress[]> {
    const endpoint = `/challenges/user/my-challenges${status ? `?status=${status}` : ''}`;
    const response = await this.request<ChallengeProgress[]>(endpoint);
    return response.data!;
  }

  // Leaderboard methods
  async getLeaderboard(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' = 'ALL_TIME', limit: number = 50): Promise<LeaderboardData> {
    const response = await this.request<LeaderboardData>(`/leaderboard?period=${period}&limit=${limit}`);
    return response.data!;
  }

  async getLeaderboardStats(): Promise<LeaderboardStats> {
    const response = await this.request<LeaderboardStats>('/leaderboard/stats');
    return response.data!;
  }

  async getUserRank(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' = 'ALL_TIME'): Promise<{
    userId: string;
    xp: number;
    rank: number;
    period: string;
  }> {
    const response = await this.request<{
      userId: string;
      xp: number;
      rank: number;
      period: string;
    }>(`/leaderboard/user-rank?period=${period}`);
    return response.data!;
  }

  // Category methods
  async getCategories(includeInactive = false): Promise<Category[]> {
    const endpoint = `/categories${includeInactive ? '?includeInactive=true' : ''}`;
    const response = await this.request<Category[]>(endpoint);
    return response.data!;
  }

  async getCategoryById(id: string): Promise<Category> {
    const response = await this.request<Category>(`/categories/${id}`);
    return response.data!;
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    const response = await this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleCategoryStatus(id: string): Promise<Category> {
    const response = await this.request<Category>(`/categories/${id}/toggle-status`, {
      method: 'PATCH',
    });
    return response.data!;
  }

  // Utility methods
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Create and export API client instance

export const apiClient = new ApiClient(API_BASE_URL);

// ✅ Export helper for easier use in the frontend
export const createChallenge = (data: CreateChallengeRequest) =>
  apiClient.createChallenge(data);
