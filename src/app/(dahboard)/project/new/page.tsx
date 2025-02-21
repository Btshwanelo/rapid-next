'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log("Project data:", formData);
    // Add your API call or state management logic here
  };

  return (
    <div className="flex  items-center justify-center mt-10">
      <Card className="w-full max-w-7xl bg-[#0f0f43] backdrop-blur-sm shadow-xl border-0">
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-white">Project Details</h1>
              <p className="text-gray-300">
                Give your project a name and description
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-lg font-medium text-white"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Project name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-navy-900 bg-opacity-50 border-gray-700  placeholder:text-gray-500 h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-lg font-medium text-white"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="eg: description..."
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-navy-900 bg-opacity-50 border-gray-700  placeholder:text-gray-500 min-h-24"
                />
              </div>

              <Button
                type="submit"
                className="w-32 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
              >
                CREATE
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}