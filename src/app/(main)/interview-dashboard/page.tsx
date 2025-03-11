'use client'
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useLazyGetPersonasByProjectQuery } from '@/services/personaService';
import useProject from '@/hooks/useProject';
import useAuth from '@/hooks/useAuth';

// Define interface for the API response data
interface PersonaData {
  _id: string;
  name: string;
  description: string;
  age: number;
  gender: number;
  educationLevel: string;
  hobbies: string[];
  profession: string;
  personalityTraits: string[];
  goals: string;
  challenges: string;
  preferredCommunication: string;
  visualElements: string;
  quest: string;
  dayInLife: string;
  brandsAndProducts: string;
  technologyUsage: string;
  interviewQuestions: {
    _id: string;
    question: string;
    answer: string;
  }[];
  analysis: string;
  nextSteps: string[];
  projectId: string;
  segmentId: string;
  createdAt: string;
}

// Interface for the processed interview data to be displayed in the table
interface Interview {
  id: string;
  segment: string;
  date: string;
  status: 'complete' | 'incomplete';
  notes: string;
  personaName: string;
}

export default function InterviewDashboard() {
  // State for storing API data and UI state
  const [personas, setPersonas] = useState<PersonaData[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [segments, setSegments] = useState<string[]>(["All Segments"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const authDetails = useAuth();
  const projectDetails = useProject();

  const [getPersonasByProject, getPersonasProps] = useLazyGetPersonasByProjectQuery();

  // Fetch personas data when component mounts
  useEffect(() => {
    if (projectDetails?._id && authDetails?.token) {
      fetchPersonas();
    }
  }, [projectDetails?._id, authDetails?.token]);

  // Process personas data when API response changes
  useEffect(() => {
    if (getPersonasProps.isLoading) {
      setIsLoading(true);
    } else if (getPersonasProps.isError) {
      setIsLoading(false);
      setError('Failed to load personas data. Please try again.');
    } else if (getPersonasProps.isSuccess && getPersonasProps.data) {
      setIsLoading(false);
      setError(null);
      
      // Get personas from API response
      const fetchedPersonas = getPersonasProps.data.data || [];
      setPersonas(fetchedPersonas);
      
      // Process personas into interviews format
      processPersonasToInterviews(fetchedPersonas);
    }
  }, [getPersonasProps.data, getPersonasProps.isLoading, getPersonasProps.isError, getPersonasProps.isSuccess]);

  // Function to fetch personas data
  const fetchPersonas = () => {
    if (!projectDetails?._id || !authDetails?.token) return;
    
    getPersonasByProject({
      id: projectDetails._id,
      authToken: authDetails.token
    });
  };

  // Convert personas data to interviews format
  const processPersonasToInterviews = (personas: PersonaData[]) => {
    // Create unique segments list
    const uniqueSegments = ["All Segments"];
    
    // Convert personas to interviews format
    const processedInterviews = personas.map(persona => {
      // Assume segment name could be derived from profession or another field
      const segment = persona.profession || "Unnamed Segment";
      
      // Add segment to uniqueSegments if not already there
      if (!uniqueSegments.includes(segment)) {
        uniqueSegments.push(segment);
      }
      
      // Create an interview object for each persona
      return {
        id: persona._id,
        segment: segment,
        date: new Date(persona.createdAt).toISOString().split('T')[0],
        // Assume complete if there are interview questions with answers
        status: persona.interviewQuestions.some(q => q.answer) ? 'complete' as const : 'incomplete' as const,
        notes: persona.description.length > 50 ? persona.description.substring(0, 47) + '...' : persona.description,
        personaName: persona.name
      };
    });
    
    setSegments(uniqueSegments);
    setInterviews(processedInterviews);
  };

  // Calculate progress
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter(i => i.status === 'complete').length;
  const progressPercent = totalInterviews > 0 ? (completedInterviews / totalInterviews) * 100 : 0;

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-white">Loading interview data...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="bg-[#0f0f43] border-none p-6">
          <CardContent>
            <p className="text-red-400">{error}</p>
            <Button className="mt-4" onClick={fetchPersonas}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto space-y-6">
        <div className='flex'>
          <h1 className="text-2xl font-bold text-white">Interview Overview</h1>
          {interviews.length > 0 && (
            <Link href={`/interview-dashboard/analysis`} className='ml-auto'>
              <Button variant="default" className='bg-blue-600' size="sm">
                Interviews Analysis
              </Button>
            </Link>
          )}
        </div>
        
        {/* Progress Card */}
        <Card className="bg-[#0f0f43] border-none">
          <CardContent className="pt-6">
            <p className="text-gray-300 mb-3">
              {totalInterviews === 0 ? (
                "No interviews available yet."
              ) : (
                `You have completed ${completedInterviews} out of ${totalInterviews} planned interviews.`
              )}
            </p>
            <Progress value={progressPercent} className="h-2" />
          </CardContent>
        </Card>

        {/* Interviews Section */}
        {interviews.length > 0 ? (
          <Card className='bg-[#0f0f43] border-none'>
            <CardContent className="pt-6">
              <Tabs defaultValue="all-segments" className="space-y-6">
                <TabsList className="space-x-2 bg-[#0f0f43] p-1">
                  {segments.map((segment) => (
                    <TabsTrigger
                      key={segment}
                      value={segment.toLowerCase().replace(/\s+/g, '-')}
                      className="data-[state=active]:bg-blue-600"
                    >
                      {segment}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {segments.map((segment) => (
                  <TabsContent
                    key={segment}
                    value={segment.toLowerCase().replace(/\s+/g, '-')}
                  >
                    <Table className='text-gray-300'>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Persona</TableHead>
                          <TableHead>Segment</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[300px]">Notes</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {interviews
                          .filter(interview => 
                            segment === "All Segments" || 
                            interview.segment === segment
                          )
                          .map((interview) => (
                            <TableRow key={interview.id}>
                              <TableCell className="font-medium">
                                {interview.personaName}
                              </TableCell>
                              <TableCell>
                                {interview.segment}
                              </TableCell>
                              <TableCell>{interview.date}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    interview.status === 'complete'
                                      ? 'bg-green-50 text-green-700 border-green-200'
                                      : 'bg-orange-50 text-orange-700 border-orange-200'
                                  }
                                >
                                  {interview.status === 'complete' ? 'Complete' : 'Incomplete'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-400">
                                {interview.notes}
                              </TableCell>
                              <TableCell className='flex gap-2'>
                                <Link href={`/interview-dashboard/${interview.id}/interview`}>
                                  <Button variant="default" className='bg-blue-600' size="sm">
                                    Interview
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className='bg-[#0f0f43] border-none'>
            <CardContent className="py-6 text-center">
              <p className="text-gray-300 mb-4">No interview personas available.</p>
              <Button variant="default" className='bg-blue-600' size="sm">
                Create Your First Persona
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}