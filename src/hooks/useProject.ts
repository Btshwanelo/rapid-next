import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProjectStore } from "../store/projectStore";
import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5002/api/v2/projects";


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
  const token = localStorage.getItem("token"); // Retrieve token from storage
  if (!token) throw new Error("No auth token found. Please log in.");

  const res = await fetch(`${API_BASE_URL}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add authorization token
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch projects");
  }

  const result = await res.json();
  return result.data;
};

// Fetch Project By ID
const fetchProjectById = async (projectId: string): Promise<Project> => {
  const token = localStorage.getItem("token"); // Retrieve token from storage
  if (!token) throw new Error("No auth token found. Please log in.");

  const res = await fetch(`${API_BASE_URL}/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add authorization token
    },
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch project");
  }  
  const result = await res.json();
  return result.data;
};

const createProject = async (data: Project) => {
  const token = localStorage.getItem("token"); // Retrieve token from storage
  if (!token) throw new Error("No auth token found. Please log in.");

  try {
    const res = await fetch(`${API_BASE_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add authorization token
      },
      body: JSON.stringify(data),
      // Add timeout control
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });
    
    // Handle HTTP error responses
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        message: errorData.message || "Failed to create project",
        statusCode: res.status
      };
    }
    
    return res.json();
  } catch (error) {
    // Handle network errors and timeouts
    if (error instanceof DOMException && error.name === "AbortError") {
      throw { message: "Request timeout. Please try again." };
    }
    
    // Re-throw the error to be handled by the mutation
    throw error instanceof Error 
      ? { message: error.message }
      : error;
  }
};

// Update Existing Project
const updateProject = async ({
  projectId,
  projectData,
}: {
  projectId: string;
  projectData: Partial<Project>;
}): Promise<Project> => {
  const token = localStorage.getItem("token"); // Retrieve token from storage
  if (!token) throw new Error("No auth token found. Please log in.");

  const res = await fetch(`${API_BASE_URL}/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add authorization token
    },
    body: JSON.stringify(projectData),
  });
  
  if (!res.ok) {const errorData = await res.json();throw new Error(errorData.message || "Failed to update project")};
  
  const result = await res.json();
  return result.data;
};

// React Query Hook
export const useProject = () => {
  const queryClient = useQueryClient();
  const {currentProject} = useProjectStore()
  const {setCurrentProject,setProjects} = useProjectStore()
  const [createProjectError, setCreateProjectError] = useState<string | null>(null);

  // Get All Projects
//  const { data, isLoading, isError, refetch, error } = useQuery<Project[], Error>({
//     queryKey: ["dashboard"],
//     queryFn: fetchProjects,
//     staleTime: 1000 * 60 * 5, // Cache for 5 minutes
//     onSuccess: (data:any) => {
//       setProjects(data);
//     },
//     onError: (err:any) => {
//       console.error("Error fetching dashboard:", err.message);
//       setProjects([]);
//     },
//   });

  // Get Project by ID
    // const { data:projectData, isLoadingprojectIsLoading, isError:projectIsloading, error:projectError } = useQuery<Project, Error>({
    //   queryKey: ["project"],
    //   queryFn: fetchProjectById(currentProject?.),
    //   staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    //   onSuccess: (data:any) => {
    //     setCurrentProject(data);
    //   },
    //   onError: (err:any) => {
    //     console.error("Error fetching dashboard:", err.message);
    //     setProjects([]);
    //   },
    // });

  // Create Project Mutation
  const createProjectMutation = useMutation({mutationFn:createProject, 
    onSuccess: (newProject) => {
      setCurrentProject(newProject)
      queryClient.invalidateQueries({queryKey:["projects"]});
  },
  onError:(error)=>{
    console.error("Create Project Error:", error);
    setCreateProjectError(error.message || "Failed to create project. Please try again.");
  }
});


const updateProjectMutation = useMutation({mutationFn:updateProject, 
  onSuccess: (newProject) => {
    setCurrentProject(newProject)
    queryClient.invalidateQueries({queryKey:["projects"]});
},
onError:(error)=>{
  console.error("Update Project Error:", error);
  setCreateProjectError(error.message || "Failed to update project. Please try again.");
}
});

  return {
    createProject:(data:any)=>{
      createProjectMutation.mutate(data)
    },
    updateProject:(data:any)=>{
      updateProjectMutation.mutate(data)
    },
    createProjectMutation,
    updateProjectMutation,
  };
};
