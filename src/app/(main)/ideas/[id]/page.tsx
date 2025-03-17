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
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useLazyGetIdeaByIdQuery, useUpdateIdeaMutation } from '@/services/ideaService';
import { useParams } from 'next/navigation';
import useProject from '@/hooks/useProject';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useIdeaClarifierMutation, useIdeaEvaluatorMutation, useIdeaStakeholderMutation, useIdeaTrendsMutation } from '@/slices/autogenApiSlice';
import { extractClarifierData, extractClarifyingQiestions, extractEvaluationData, extractStakeholders } from '@/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  pros: string[];
  cons: string[];
  requiredResources: string[];
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
  clarifyingQuestions: {
    question: string;
    answer?: string;
    _id: string;
  }[];
  trendApplications: {
    trend: string;
    application: string;
    _id: string;
  }[];
  stakeholderEvaluations: {
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

// New interface to track loading states
interface LoadingStates {
  initial: boolean;
  clarifier: boolean;
  trends: boolean;
  stakeholder: boolean;
  evaluator: boolean;
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
  const [IdeaClarifier, clarifierIdeaProps] = useIdeaClarifierMutation();
  const [IdeaTrends, trendsIdeaProps] = useIdeaTrendsMutation();
  const [IdeaStakeholder, stakeholderIdeaProps] = useIdeaStakeholderMutation();
  const [IdeaEvaluator, evaluatorIdeaProps] = useIdeaEvaluatorMutation();

  // Loading and error states
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    initial: true,
    clarifier: false,
    trends: false,
    stakeholder: false,
    evaluator: false
  });
  const [error, setError] = useState<string | null>(null);
  
  // State to track which enhancement calls have been initiated
  const [enhancementCalls, setEnhancementCalls] = useState({
    clarifier: false,
    trends: false,
    stakeholder: false,
    evaluator: false
  });

  useEffect(() => {
    getIdea({ authToken: authDetails.token, id });
  }, []);

  // Update loading and error states based on API response
  useEffect(() => {
    if (getIdeaProps.isLoading) {
      setLoadingStates(prev => ({ ...prev, initial: true }));
    } else if (getIdeaProps.isError) {
      setLoadingStates(prev => ({ ...prev, initial: false }));
      setError('Failed to load idea details. Please try again.');
    } else if (getIdeaProps.isSuccess) {
      setLoadingStates(prev => ({ ...prev, initial: false }));
      setError(null);

      const idea = getIdeaProps.data.data;

      // Check if we need to make enhancement API calls and haven't initiated them yet
      if (idea.clarifyingQuestions.length === 0 && !enhancementCalls.clarifier) {
        setLoadingStates(prev => ({ ...prev, clarifier: true }));
        IdeaClarifier({message:`Idea: ${idea.title}. IedaDescription: ${idea.description}`});
        setEnhancementCalls(prev => ({ ...prev, clarifier: true }));
      }

      if (idea.trendApplications.length === 0 && !enhancementCalls.trends) {
        setLoadingStates(prev => ({ ...prev, trends: true }));
        IdeaTrends({message:`Idea: ${idea.title}. IedaDescription: ${idea.description}`});
        setEnhancementCalls(prev => ({ ...prev, trends: true }));
      }

      if (idea.stakeholderEvaluations.length === 0 && !enhancementCalls.stakeholder) {
        setLoadingStates(prev => ({ ...prev, stakeholder: true }));
        IdeaStakeholder({message:`Idea: ${idea.title}. IedaDescription: ${idea.description}`});
        setEnhancementCalls(prev => ({ ...prev, stakeholder: true }));
      }

      if ((idea.pros.length === 0 || idea.cons.length === 0) && !enhancementCalls.evaluator) {
        setLoadingStates(prev => ({ ...prev, evaluator: true }));
        IdeaEvaluator({message:`Idea: ${idea.title}. IedaDescription: ${idea.description}`});
        setEnhancementCalls(prev => ({ ...prev, evaluator: true }));
      }
    }
  }, [getIdeaProps.isLoading, getIdeaProps.isError, getIdeaProps.isSuccess]);

  // Handle clarifier API response
  useEffect(() => {
    if (clarifierIdeaProps.isLoading) {
      setLoadingStates(prev => ({ ...prev, clarifier: true }));
    } else if (clarifierIdeaProps.isSuccess) {
      const clarifyingQuestions = extractClarifyingQiestions(clarifierIdeaProps.data);
      updateIdea({body:{clarifyingQuestions}, id, authToken:authDetails.token});
      setLoadingStates(prev => ({ ...prev, clarifier: false }));
    } else if (clarifierIdeaProps.isError) {
      setLoadingStates(prev => ({ ...prev, clarifier: false }));
    }
  }, [clarifierIdeaProps.isLoading, clarifierIdeaProps.isSuccess, clarifierIdeaProps.isError]);

  // Handle trends API response
  useEffect(() => {
    if (trendsIdeaProps.isLoading) {
      setLoadingStates(prev => ({ ...prev, trends: true }));
    } else if (trendsIdeaProps.isSuccess) {
      const applicableTrends = extractClarifierData(trendsIdeaProps.data);
      updateIdea({body:{trendApplications:applicableTrends}, id, authToken:authDetails.token});
      setLoadingStates(prev => ({ ...prev, trends: false }));
    } else if (trendsIdeaProps.isError) {
      setLoadingStates(prev => ({ ...prev, trends: false }));
    }
  }, [trendsIdeaProps.isLoading, trendsIdeaProps.isSuccess, trendsIdeaProps.isError]);

  // Handle stakeholder API response
  useEffect(() => {
    if (stakeholderIdeaProps.isLoading) {
      setLoadingStates(prev => ({ ...prev, stakeholder: true }));
    } else if (stakeholderIdeaProps.isSuccess) {
      const stakeholders = extractStakeholders(stakeholderIdeaProps.data);
      updateIdea({body:{stakeholderEvaluations:stakeholders}, id, authToken:authDetails.token});
      setLoadingStates(prev => ({ ...prev, stakeholder: false }));
    } else if (stakeholderIdeaProps.isError) {
      setLoadingStates(prev => ({ ...prev, stakeholder: false }));
    }
  }, [stakeholderIdeaProps.isLoading, stakeholderIdeaProps.isSuccess, stakeholderIdeaProps.isError]);

  // Handle evaluator API response
  useEffect(() => {
    if (evaluatorIdeaProps.isLoading) {
      setLoadingStates(prev => ({ ...prev, evaluator: true }));
    } else if (evaluatorIdeaProps.isSuccess) {
      const evaluationData = extractEvaluationData(evaluatorIdeaProps.data);
      updateIdea({body:evaluationData, id, authToken:authDetails.token});
      setLoadingStates(prev => ({ ...prev, evaluator: false }));
    } else if (evaluatorIdeaProps.isError) {
      setLoadingStates(prev => ({ ...prev, evaluator: false }));
    }
  }, [evaluatorIdeaProps.isLoading, evaluatorIdeaProps.isSuccess, evaluatorIdeaProps.isError]);

  const idea = getIdeaProps.data?.data as ApiIdea ;

  // Helper function to determine if any AI enhancement is in progress
  const isAnyEnhancementLoading = () => {
    return loadingStates.clarifier || loadingStates.trends || 
           loadingStates.stakeholder || loadingStates.evaluator;
  };

  // Helper function to get active enhancements
  const getActiveEnhancements = () => {
    const active = [];
    if (loadingStates.clarifier) active.push("clarifying questions");
    if (loadingStates.trends) active.push("trend applications");
    if (loadingStates.stakeholder) active.push("stakeholder evaluations");
    if (loadingStates.evaluator) active.push("pros & cons analysis");
    return active;
  };

  if (loadingStates.initial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-white">Loading idea details...</p>
        </div>
      </div>
    );
  }

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
            <ArrowLeft className='text-gray-400 mr-1' /> back
          </Link>
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
      </div>

      {/* AI Enhancement Status Banner */}
      {isAnyEnhancementLoading() && (
        <Alert className="bg-blue-900/30 border-blue-800">
          <Loader2 className="h-4 w-4 animate-spin text-blue-400 mr-2" />
          <AlertTitle className="text-blue-300">AI enhancements in progress</AlertTitle>
          <AlertDescription className="text-blue-200">
            We're generating {getActiveEnhancements().join(", ")} for this idea. 
            This may take a moment. You can still explore the available content while we work on enhancing your idea.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-[#0f0f43] border-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold">Impact</h3>
              {loadingStates.evaluator ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400 mr-2" />
                  <span className="text-blue-400">Calculating...</span>
                </div>
              ) : (
                <span className="text-blue-400">{idea.impact}%</span>
              )}
            </div>
            <Progress value={loadingStates.evaluator ? 15 : idea.impact} className="bg-blue-950" />
          </CardContent>
        </Card>
        <Card className="bg-[#0f0f43] border-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold">Feasibility</h3>
              {loadingStates.evaluator ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400 mr-2" />
                  <span className="text-blue-400">Calculating...</span>
                </div>
              ) : (
                <span className="text-blue-400">{idea.feasibility}%</span>
              )}
            </div>
            <Progress value={loadingStates.evaluator ? 15 : idea.feasibility} className="bg-blue-950" />
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
            {loadingStates.clarifier && (
              <Loader2 className="h-3 w-3 animate-spin ml-2" />
            )}
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-blue-600">
            Trend Applications
            {loadingStates.trends && (
              <Loader2 className="h-3 w-3 animate-spin ml-2" />
            )}
          </TabsTrigger>
          <TabsTrigger value="stakeholders" className="data-[state=active]:bg-blue-600">
            Stakeholder Evaluations
            {loadingStates.stakeholder && (
              <Loader2 className="h-3 w-3 animate-spin ml-2" />
            )}
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
                  {loadingStates.evaluator && (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStates.evaluator ? (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
                    <p>Analyzing the advantages of this idea...</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {idea?.pros?.length > 0 ? idea?.pros?.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                        {pro}
                      </li>
                    )) : (
                      <p className="text-gray-400">No pros available yet.</p>
                    )}
                  </ul>
                )}
              </CardContent>
            </Card>
            <Card className="bg-[#0f0f43] border-none">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Cons
                  {loadingStates.evaluator && (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStates.evaluator ? (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
                    <p>Identifying potential challenges...</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {idea.cons?.length > 0 ? idea.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <XCircle className="h-4 w-4 text-red-500 mt-1" />
                        {con}
                      </li>
                    )) : (
                      <p className="text-gray-400">No cons available yet.</p>
                    )}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timeline & Resources */}
          <Card className="bg-[#0f0f43] border-none">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline & Resources
                {loadingStates.evaluator && (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                )}
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
                {loadingStates.evaluator ? (
                  <div className="flex items-center text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Identifying required resources...</span>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {idea?.requiredResources?.length > 0 ? idea?.requiredResources?.map((resource, index) => (
                      <li key={index} className="text-gray-300">{resource}</li>
                    )) : (
                      <p className="text-gray-400">No resources identified yet.</p>
                    )}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card className="bg-[#0f0f43] border-none">
            <CardContent className="p-6">
              {loadingStates.clarifier ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
                  <p className="text-lg mb-2">Generating clarifying questions...</p>
                  <p className="text-sm text-gray-500">This helps stakeholders better understand the idea.</p>
                </div>
              ) : (
                <div className="space-y-6">
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
                    <p className="text-gray-400">No clarifying questions available yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-[#0f0f43] border-none">
            <CardContent className="p-6">
              {loadingStates.trends ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
                  <p className="text-lg mb-2">Analyzing market trends...</p>
                  <p className="text-sm text-gray-500">We're identifying relevant trends and their applications to this idea.</p>
                </div>
              ) : (
                <div className="space-y-6">
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
                    <p className="text-gray-400">No trend applications available yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stakeholders" className="space-y-6">
          <div className="grid gap-6">
            {loadingStates.stakeholder ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
                <p className="text-lg mb-2">Generating stakeholder evaluations...</p>
                <p className="text-sm text-gray-500">We're analyzing how different stakeholders might view this idea.</p>
              </div>
            ) : (
              <>
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
                  <p className="text-gray-400">No stakeholder evaluations available yet.</p>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}