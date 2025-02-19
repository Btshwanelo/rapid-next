// types.ts
interface Idea {
    id: string;
    title: string;
    description: string;
    methodology?: string;
    isAIGenerated: boolean;
    status: 'active' | 'rejected';
    category?: string;
    createdAt: Date;
    // Extended properties
    impact?: number;
    feasibility?: number;
    pros?: string[];
    cons?: string[];
    timeline?: {
      research: string;
      development: string;
      testing: string;
    };
    requiredResources?: string[];
    collaborators?: {
      department: string;
      votes: number;
    }[];
    version?: {
      number: string;
      date: string;
      changes: string;
    }[];
    clarifyingQuestions?: {
      question: string;
      answer?: string;
    }[];
    trendApplications?: {
      trend: string;
      application: string;
    }[];
    stakeholderEvaluations?: {
      name: string;
      role: string;
      rating: number;
      feedback: string;
      concerns: string[];
      opportunities: string[];
      avatar?: string;
    }[];
  }
  
  // IdeaDetailPage.tsx
  'use client';
  
  import { useState } from 'react';
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
    XCircle
  } from "lucide-react";
  
  interface IdeaDetailPageProps {
    idea: Idea;
  }
  
  export default function IdeaDetailPage() {
    const [activeTab, setActiveTab] = useState('overview');
  const [idea, setIdea] = useState(sampleIdea)
    return (
      <div className="min-h-screen space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <span>{idea.category}</span>
              <ChevronRight className="h-4 w-4" />
              <Badge variant={idea.status === 'active' ? 'default' : 'destructive'}>
                {idea.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-white">{idea.title}</h1>
            <p className="text-gray-400 mt-2">{idea.description}</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Edit Idea
          </Button>
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
                  <h3 className="text-white font-semibold mb-4">Milestones</h3>
                  <ul className="space-y-2">
                    <li className="text-gray-300">Research: {idea.timeline?.research}</li>
                    <li className="text-gray-300">Development: {idea.timeline?.development}</li>
                    <li className="text-gray-300">Testing: {idea.timeline?.testing}</li>
                  </ul>
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
                {idea.clarifyingQuestions?.map((q, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-white font-semibold">{q.question}</h3>
                    <p className="text-gray-300 bg-blue-500/10 p-4 rounded-lg">
                      {q.answer || 'Not answered yet'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
  
          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-[#0f0f43] border-none">
              <CardContent className="p-6 space-y-6">
                {idea.trendApplications?.map((trend, index) => (
                  <div key={index} className="flex items-start gap-4 bg-blue-500/10 p-4 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-400 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold">{trend.trend}</h3>
                      <p className="text-gray-300 mt-1">{trend.application}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
  
          <TabsContent value="stakeholders" className="space-y-6">
            <div className="grid gap-6">
              {idea.stakeholderEvaluations?.map((stakeholder, index) => (
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
                              i < stakeholder.rating 
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
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }


  // sampleIdea.ts

export const sampleIdea: Idea = {
    id: "idea-001",
    title: "User-Centric Mobile App",
    description: "A mobile application that adapts its interface based on user behavior patterns and preferences, creating a more personalized and efficient user experience.",
    methodology: "Agile development with weekly user testing and feedback loops",
    isAIGenerated: false,
    status: 'active',
    category: "Mobile Development",
    createdAt: new Date("2024-02-15"),
    impact: 85,
    feasibility: 75,
    
    pros: [
      "Highly personalized user experience",
      "Increased user engagement and retention",
      "Data-driven decision making",
      "Potential for continuous improvement"
    ],
    
    cons: [
      "Complex implementation required",
      "Privacy concerns need to be addressed",
      "Resource intensive development",
      "Requires significant user data collection"
    ],
    
    timeline: {
      research: "1 month",
      development: "3 months",
      testing: "2 months"
    },
    
    requiredResources: [
      "Mobile developers",
      "UX designers",
      "Data analysts",
      "Machine learning engineers",
      "QA testers"
    ],
    
    collaborators: [
      { department: "Product", votes: 15 },
      { department: "Engineering", votes: 12 },
      { department: "Design", votes: 8 },
      { department: "Data Science", votes: 7 }
    ],
    
    version: [
      {
        number: "v1.2",
        date: "2024-01-15",
        changes: "Added AI features for better personalization"
      },
      {
        number: "v1.1",
        date: "2024-01-01",
        changes: "Initial concept with basic personalization"
      }
    ],
    
    clarifyingQuestions: [
      {
        question: "How will this benefit the end user?",
        answer: "Users will experience a more intuitive interface that adapts to their usage patterns, resulting in faster task completion and improved satisfaction."
      },
      {
        question: "What technical resources are needed?",
        answer: "We'll need a full-stack team including mobile developers, UX designers, and data scientists for the AI/ML components."
      },
      {
        question: "What's the timeline for implementation?",
        answer: "Initial MVP in 3-6 months, with continuous improvements based on user feedback and data analysis."
      }
    ],
    
    trendApplications: [
      {
        trend: "AI/ML",
        application: "Implement machine learning algorithms to predict user preferences and adapt the interface accordingly."
      },
      {
        trend: "Privacy-First Design",
        application: "Ensure all personalization features respect user privacy and comply with data protection regulations."
      },
      {
        trend: "Microinteractions",
        application: "Add subtle animations and feedback mechanisms that make the app feel more responsive and engaging."
      }
    ],
    
    stakeholderEvaluations: [
      {
        name: "Sarah Chen",
        role: "Product Manager",
        rating: 5,
        feedback: "Strong potential for customer satisfaction improvement. Need to ensure proper AI training.",
        concerns: [
          "Integration with existing customer service workflow",
          "Training time for AI models"
        ],
        opportunities: [
          "Could expand to multiple languages in future phases",
          "Potential for predictive user assistance"
        ],
        avatar: "/api/placeholder/150/150"
      },
      {
        name: "Mike Rodriguez",
        role: "Technical Lead",
        rating: 4,
        feedback: "Technically challenging but feasible. Will require careful architecture planning.",
        concerns: [
          "System scalability",
          "Data storage optimization",
          "Real-time processing requirements"
        ],
        opportunities: [
          "Platform for future AI/ML initiatives",
          "Improved user behavior analytics"
        ],
        avatar: "/api/placeholder/150/150"
      },
      {
        name: "Emily Watson",
        role: "UX Designer",
        rating: 4,
        feedback: "Great potential for improving user experience. Need to ensure transitions are smooth.",
        concerns: [
          "User interface consistency",
          "Handling edge cases in personalization"
        ],
        opportunities: [
          "Enhanced user engagement",
          "Reduced learning curve for new users"
        ],
        avatar: "/api/placeholder/150/150"
      }
    ]
  };