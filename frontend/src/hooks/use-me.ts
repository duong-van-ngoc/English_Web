import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.getCurrentUser(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      name: string;
      toeicGoal?: number;
      level?: string;
      avatarUrl?: string;
    }) => api.updateProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: {
      currentPassword: string;
      newPassword: string;
    }) => api.changePassword(payload),
  });
}
