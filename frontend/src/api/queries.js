import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";

// --- Projects Queries ---
export const useProjects = (filters, activeTab) => {
  return useQuery({
    queryKey: ["projects", filters, activeTab],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
      });
      if (filters.search) query.append("search", filters.search);
      if (filters.member) query.append("member", filters.member);
      if (filters.status) query.append("status", filters.status);
      if (filters.sort) query.append("sort", filters.sort);
      if (filters.urgent) query.append("urgent", "true");
      if (activeTab === "plan") query.append("isPlanned", "true");

      const { data } = await axiosInstance.get(`/projects?${query.toString()}`);
      return data;
    },
  });
};

// --- Dashboard Extra Info (Stats, Members, Profiles) ---
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/dashboard/stats");
      return data;
    },
  });
};

export const useMembers = () => {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/dashboard/members");
      return data;
    },
  });
};

export const useProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/dashboard/profiles");
      return data;
    },
  });
};

// --- Mutations ---
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};

export const useTogglePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPlanned }) =>
      axiosInstance.patch(`/projects/${id}/plan`, { isPlanned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useSaveCrudItem = (type) => {
  const queryClient = useQueryClient();
  const endpoint = type === "members" ? "members" : "profiles";
  
  return useMutation({
    mutationFn: ({ id, name }) => {
      if (id) {
        return axiosInstance.put(`/dashboard/${endpoint}/${id}`, { name });
      }
      return axiosInstance.post(`/dashboard/${endpoint}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
};

export const useDeleteCrudItem = (type) => {
  const queryClient = useQueryClient();
  const endpoint = type === "members" ? "members" : "profiles";

  return useMutation({
    mutationFn: (id) => axiosInstance.delete(`/dashboard/${endpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
};
