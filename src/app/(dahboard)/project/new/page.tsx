'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useCreateProjectMutation } from "@/services/projectService";
import { useDispatch } from "react-redux";
import { setCurrentProject } from "@/slices/projectSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

// Define form validation schema
const projectSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters" }).max(50),
  description: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function CreateProject() {
  const [createProject, { isLoading, isSuccess, isError, error, data }] = useCreateProjectMutation();
  const router = useRouter();
  const dispatch = useDispatch();
    const authDetails = useAuth()


  // Initialize form with validation
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: ProjectFormValues) => {
    try {
      await createProject({body:{
        name: values.name,
        description: values.description || "",
        projectType:"design",
        image: "https://placehold.co/400" // Default placeholder image
      },authToken:authDetails.token}).unwrap();
    } catch (err) {
      toast.error("Failed to create project. Please try again.");
    }
  };

  // Handle success
  useEffect(() => {
    if (isSuccess && data) {
      // Store in Redux
      dispatch(setCurrentProject(data.data));
      
      // Show success toast
      toast.success("Project created successfully!");
      
      // Navigate to next page
      router.push('/problem-statement');
    }
  }, [isSuccess, data, dispatch, router]);

  return (
    <div className="flex items-center justify-center mt-10">
      <Card className="w-full max-w-7xl bg-[#0f0f43] backdrop-blur-sm shadow-xl border-0">
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-white">Project Details</h1>
              <p className="text-gray-300">
                Give your project a name and description
              </p>
            </div>

            {isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error?.data?.message || "An error occurred while creating your project."}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-lg font-medium text-white">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Project name"
                          {...field}
                          className="bg-navy-900 bg-opacity-50 border-gray-700 placeholder:text-gray-500 h-12"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-lg font-medium text-white">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="eg: description..."
                          {...field}
                          className="bg-navy-900 bg-opacity-50 border-gray-700 placeholder:text-gray-500 min-h-24"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-32 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      SAVING
                    </>
                  ) : (
                    "CREATE"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}