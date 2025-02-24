import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProjectStore } from "../store/projectStore";

const PROD_BASE_URL = "http://172.172.166.174:5002/api/v2/projects";

// Define Project Type
type Project = {
  _id: string;
  name: string;
  description: string;
  image: string;
  projectType: string;
  createdAt: string;
};

// Fetch All Projects
const fetchProjects = async (): Promise<Project[]> => {
  const res = await fetch(`${PROD_BASE_URL}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  const result = await res.json();
  return result.data;
};

// Fetch Project By ID
const fetchProjectById = async (projectId: string): Promise<Project> => {
  const res = await fetch(`${PROD_BASE_URL}/${projectId}`);
  if (!res.ok) throw new Error("Project not found");
  const result = await res.json();
  return result.data;
};

// Create New Project
const createProject = async (project: Partial<Project>): Promise<Project> => {
  const res = await fetch(`${PROD_BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Failed to create project");
  const result = await res.json();
  return result.data;
};

// Update Existing Project
const updateProject = async ({
  projectId,
  projectData,
}: {
  projectId: string;
  projectData: Partial<Project>;
}): Promise<Project> => {
  const res = await fetch(`${PROD_BASE_URL}/${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error("Failed to update project");
  const result = await res.json();
  return result.data;
};

// React Query Hook
export const useProject = () => {
  const queryClient = useQueryClient();
  const { setProjects, setCurrentProject } = useProjectStore();

  // Get All Projects
  const projectsQuery = useQuery<Project[], Error>(["projects"], fetchProjects, {
    onSuccess: (data) => setProjects(data),
  });

  // Get Project by ID
  const projectByIdQuery = (projectId: string) =>
    useQuery<Project, Error>(["project", projectId], () => fetchProjectById(projectId), {
      enabled: !!projectId, // Only run if projectId exists
      onSuccess: (data) => setCurrentProject(data),
    });

  // Create Project Mutation
  const createProjectMutation = useMutation(createProject, {
    onSuccess: (newProject) => {
      queryClient.invalidateQueries(["projects"]);
    },
  });

  // Update Project Mutation
  const updateProjectMutation = useMutation(updateProject, {
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["project", updatedProject._id]);
    },
  });

  return {
    projectsQuery,
    projectByIdQuery,
    createProjectMutation,
    updateProjectMutation,
  };
};
