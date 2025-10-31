import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type User, type Challenge, type ChallengeProgress, type LeaderboardData, type LeaderboardStats, type Category } from '../lib/api';

// Auth hooks
export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: Parameters<typeof apiClient.login>[0]) => apiClient.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: Parameters<typeof apiClient.register>[0]) => apiClient.register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const logout = () => {
    apiClient.clearToken();
    queryClient.clear();
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.getProfile(),
    enabled: apiClient.isAuthenticated(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.updateProfile>[0]) => apiClient.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.changePassword>[0]) => apiClient.changePassword(data),
  });
};

// Challenge hooks
export const useChallenges = (filters?: {
  category?: string;
  difficulty?: string;
  status?: 'active' | 'upcoming' | 'completed' | 'all';
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['challenges', filters],
    queryFn: () => apiClient.getChallenges(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useChallenge = (id: string) => {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: () => apiClient.getChallengeById(id),
    enabled: !!id,
  });
};

export const useJoinChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.joinChallenge>[0]) => apiClient.joinChallenge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['userChallenges'] });
    },
  });
};

export const useSubmitStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.submitStage>[0]) => apiClient.submitStage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['userChallenges'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUserChallenges = (status?: 'ACTIVE' | 'COMPLETED' | 'ABANDONED') => {
  return useQuery({
    queryKey: ['userChallenges', status],
    queryFn: () => apiClient.getUserChallenges(status),
    enabled: apiClient.isAuthenticated(),
  });
};

// Leaderboard hooks
export const useLeaderboard = (period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' = 'ALL_TIME', limit: number = 50) => {
  return useQuery({
    queryKey: ['leaderboard', period, limit],
    queryFn: () => apiClient.getLeaderboard(period, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLeaderboardStats = () => {
  return useQuery({
    queryKey: ['leaderboardStats'],
    queryFn: () => apiClient.getLeaderboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserRank = (period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' = 'ALL_TIME') => {
  return useQuery({
    queryKey: ['userRank', period],
    queryFn: () => apiClient.getUserRank(period),
    enabled: apiClient.isAuthenticated(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Category hooks
export const useCategories = (includeInactive = false) => {
  return useQuery({
    queryKey: ['categories', includeInactive],
    queryFn: () => apiClient.getCategories(includeInactive),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.createCategory>[0]) => apiClient.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Utility hooks
export const useIsAuthenticated = () => {
  return apiClient.isAuthenticated();
};

// Custom hook for challenge progress calculation
export const useChallengeProgress = (challenge: Challenge | undefined) => {
  if (!challenge?.userProgress) {
    return {
      completedStages: 0,
      totalStages: challenge?.stages.length || 0,
      progressPercentage: 0,
      isCompleted: false,
      nextStage: null,
    };
  }

  const completedStages = challenge.userProgress.stages.filter(
    stage => stage.status === 'COMPLETED'
  ).length;
  
  const totalStages = challenge.stages.length;
  const progressPercentage = (completedStages / totalStages) * 100;
  const isCompleted = challenge.userProgress.status === 'COMPLETED';
  
  const nextStage = challenge.stages.find(stage => 
    !challenge.userProgress?.stages.find(sp => 
      sp.stageId === stage.id && sp.status === 'COMPLETED'
    )
  );

  return {
    completedStages,
    totalStages,
    progressPercentage,
    isCompleted,
    nextStage,
  };
};
