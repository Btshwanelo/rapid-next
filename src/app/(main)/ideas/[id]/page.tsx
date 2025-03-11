'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronRight, 
  Star, 
  Clock, 
  Users, 
  TrendingUp,
  MessageCircle,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from "lucide-react";
import { useLazyGetIdeaByIdQuery, useUpdateIdeaMutation } from '@/services/ideaService';
import { useParams } from 'next/navigation';
import useProject from '@/hooks/useProject';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

// Define API response interface based on the sample data structure
interface ApiIdea {
  _id: string;
  title: string;
  description: string;
  methodology?: string;
  isAiGenerated: boolean;
  timeline?: string;
  category?: string;
  prioritization?: {
    quadrant: string;
    position: {
      x: number;
      y: number;
    };
  };
  impact?: number;
  feasibility?: number;
  pros?: string[];
  cons?: string[];
  requiredResources?: string[];
  collaborators?: {
    department: string;
    votes: number;
    _id: string;
  }[];
  version?: {
    number: string;
    date: string;
    changes: string;
    _id: string;
  }[];
  clarifyingQuestions?: {
    question: string;
    answer?: string;
    _id: string;
  }[];
  trendApplications?: {
    trend: string;
    application: string;
    _id: string;
  }[];
  stakeholderEvaluations?: {
    name: string;
    role: string;
    rating: number;
    feedback: string;
    concerns: string[];
    opportunities: string[];
    avatar?: string;
    _id: string;
  }[];
  projectId: string;
  createdAt: string;
}

export default function IdeaDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const params = useParams();
  const id = params.id as string; 
  const projectDetails = useProject();
  const authDetails = useAuth();

  // RTK Query hooks
  const [updateIdea, updateIdeaProps] = useUpdateIdeaMutation();
  const [getIdea, getIdeaProps] = useLazyGetIdeaByIdQuery();

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch idea data when component mounts
  useEffect(() => {
    if (id && authDetails?.token) {
      getIdea({ authToken: authDetails.token, id });
    }
  }, [id, authDetails?.token, getIdea]);

  // Update loading and error states based on API response
  useEffect(() => {
    if (getIdeaProps.isLoading) {
      setIsLoading(true);
    } else if (getIdeaProps.isError) {
      setIsLoading(false);
      setError('Failed to load idea details. Please try again.');
    } else if (getIdeaProps.isSuccess) {
      setIsLoading(false);
      setError(null);
    }
  }, [getIdeaProps.isLoading, getIdeaProps.isError, getIdeaProps.isSuccess]);

  // Get the idea data from the API response
  const idea = getIdeaProps.data?.data as ApiIdea | undefined;

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading idea details...</p>
      </div>
    );
  }

  // Render error state
  if (error || !idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-[#0f0f43] border-none">
          <CardContent className="p-6">
            <p className="text-red-400">{error || 'No idea found'}</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link href={'/ideas'} className='flex text-gray-400 mb-2'>
          {/* <Button variant={'ghost'}> */}
           <ArrowLeft className='text-gray-400 mr-1' /> back
          </Link>
          {/* </Button> */}
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <span>{idea.category}</span>
            <ChevronRight className="h-4 w-4" />
            <Badge variant={idea.isAiGenerated ? 'default' : 'secondary'}>
              {idea.isAiGenerated ? 'AI Generated' : 'User Created'}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-white">{idea.title}</h1>
          <p className="text-gray-400 mt-2">{idea.description}</p>
        </div>
        {/* <Button className="bg-blue-600 hover:bg-blue-700">
          Edit Idea
        </Button> */}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-[#0f0f43] border-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold">Impact</h3>
              <span className="text-blue-400">{idea.impact}%</span>
            </div>
            <Progress value={idea.impact} className="bg-blue-950" />
          </CardContent>
        </Card>
        <Card className="bg-[#0f0f43] border-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold">Feasibility</h3>
              <span className="text-blue-400">{idea.feasibility}%</span>
            </div>
            <Progress value={idea.feasibility} className="bg-blue-950" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0f0f43] p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="questions" className="data-[state=active]:bg-blue-600">
            Clarifying Questions
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-blue-600">
            Trend Applications
          </TabsTrigger>
          <TabsTrigger value="stakeholders" className="data-[state=active]:bg-blue-600">
            Stakeholder Evaluations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Pros & Cons */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-[#0f0f43] border-none">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Pros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {idea.pros?.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-[#0f0f43] border-none">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Cons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {idea.cons?.map((con, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <XCircle className="h-4 w-4 text-red-500 mt-1" />
                      {con}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Timeline & Resources */}
          <Card className="bg-[#0f0f43] border-none">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-4">Timeline</h3>
                <div className="text-gray-300">
                  <p>Implementation: {idea.timeline || "Not specified"}</p>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Required Resources</h3>
                <ul className="space-y-2">
                  {idea.requiredResources?.map((resource, index) => (
                    <li key={index} className="text-gray-300">{resource}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card className="bg-[#0f0f43] border-none">
            <CardContent className="p-6 space-y-6">
              {idea.clarifyingQuestions?.length ? (
                idea.clarifyingQuestions.map((q, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-white font-semibold">{q.question}</h3>
                    <p className="text-gray-300 bg-blue-500/10 p-4 rounded-lg">
                      {q.answer || 'Not answered yet'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No clarifying questions available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-[#0f0f43] border-none">
            <CardContent className="p-6 space-y-6">
              {idea.trendApplications?.length ? (
                idea.trendApplications.map((trend, index) => (
                  <div key={index} className="flex items-start gap-4 bg-blue-500/10 p-4 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-400 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold">{trend.trend}</h3>
                      <p className="text-gray-300 mt-1">{trend.application}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No trend applications available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stakeholders" className="space-y-6">
          <div className="grid gap-6">
            {idea.stakeholderEvaluations?.length ? (
              idea.stakeholderEvaluations.map((stakeholder, index) => (
                <Card key={index} className="bg-[#0f0f43] border-none">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={stakeholder.avatar} />
                          <AvatarFallback>{stakeholder.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-semibold">{stakeholder.name}</h3>
                          <p className="text-gray-400">{stakeholder.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.min(stakeholder.rating / 2, 5)
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 mt-4">{stakeholder.feedback}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-red-400 font-medium mb-2">Concerns:</h4>
                        <ul className="space-y-1">
                          {stakeholder.concerns.map((concern, i) => (
                            <li key={i} className="text-gray-300 flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-red-400 mt-1" />
                              {concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-green-400 font-medium mb-2">Opportunities:</h4>
                        <ul className="space-y-1">
                          {stakeholder.opportunities.map((opportunity, i) => (
                            <li key={i} className="text-gray-300 flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-green-400 mt-1" />
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-400">No stakeholder evaluations available.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}