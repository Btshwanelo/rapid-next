'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, ArrowRight, Loader2, MessageSquare, Lightbulb } from "lucide-react";

// Sample questions (replace with API-generated questions later)
const SAMPLE_QUESTIONS = [
  "What are your main responsibilities in your current role?",
  "How do you typically approach problem-solving?",
  "What tools or software do you use most frequently?",
  "What's the biggest challenge you face in your work?",
  "How do you prefer to communicate with team members?",
];


interface Persona {
    id: string;
    name: string;
    age: number;
    gender: string;
    occupation: string;
    education: string;
    description: string;
    personalityTraits: string;
    goalsAndMotivations: string;
    challengesAndPainPoints: string;
    technologyUsage: string;
    preferredCommunication: string;
    brandsAndProducts: string;
    dayInLife: string;
    visualElements: string;
    quotes: string;
    avatarUrl: string;
    isAISuggested?: boolean;
  }

interface InterviewPageProps {
  persona: Persona;
}

export default function InterviewPage() {
    const [persona, setPersona] = useState({
        id: "1",
        name: "Sarah Chen",
        age: 32,
        gender: "Female",
        occupation: "UX Designer",
        education: "Masters in Human-Computer Interaction",
        description: "A passionate UX designer with 5 years of experience in creating intuitive digital experiences. Sarah specializes in accessibility and inclusive design practices.",
        personalityTraits: "Empathetic, detail-oriented, creative problem-solver, collaborative, always eager to learn new design trends and technologies",
        goalsAndMotivations: "To create accessible and delightful user experiences that make a real difference in people's lives. Aims to bridge the gap between complex technology and human needs.",
        challengesAndPainPoints: "Balancing stakeholder requirements with user needs, tight project deadlines, keeping up with rapidly evolving design tools and trends",
        technologyUsage: "Expert in Figma, Adobe Creative Suite, and prototyping tools. Early adopter of design technology. Heavy smartphone and tablet user for both work and personal life.",
        preferredCommunication: "Face-to-face meetings for initial discussions, Slack for quick updates, and detailed documentation in Notion. Prefers visual communication when possible.",
        brandsAndProducts: "Apple ecosystem, Figma, Notion, Slack, Medium, InVision, Abstract, Pinterest",
        dayInLife: "Starts day with team standup, works on user research and wireframes, collaborates with developers, conducts user testing sessions, documents design decisions",
        visualElements: "Clean and minimal aesthetic, accessible color palettes, user-centered design artifacts, modern tech workspace",
        quotes: "\"Design is not just what it looks like and feels like. Design is how it works.\" \"Accessibility should never be an afterthought.\"",
        avatarUrl: "/api/placeholder/150/150",
      })
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState(SAMPLE_QUESTIONS);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [analysis, setAnalysis] = useState<string>('');
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuestions = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In real implementation, fetch questions from API
    setLoading(false);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Sample analysis response
    setAnalysis(
      "Based on the responses, this persona shows strong technical aptitude and a preference for structured communication. They value efficiency and data-driven decision making."
    );
    setNextSteps([
      "Schedule follow-up interview focusing on team collaboration",
      "Explore specific examples of past projects",
      "Dive deeper into their decision-making process",
      "Investigate their experience with specific tools mentioned"
    ]);
    setActiveTab('analysis');
    setLoading(false);
  };

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={persona.avatarUrl} alt={persona.name} />
            <AvatarFallback>{persona.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white">Interview with {persona.name}</h1>
            <p className="text-gray-400">{persona.occupation}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="">
          <TabsTrigger value="questions" className="data-[state=active]:bg-secondary">
            <MessageSquare className="w-4 h-4 mr-2" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-secondary">
            <Brain className="w-4 h-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="next-steps" className="data-[state=active]:bg-secondary">
            <Lightbulb className="w-4 h-4 mr-2" />
            Next Steps
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="questions">
            <Card className="bg-[#0f0f43] border-none">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Interview Questions</h2>
                  {/* <Button onClick={handleGenerateQuestions} disabled={loading}>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Questions
                  </Button> */}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={index} className="space-y-2">
                        <p className="text-white font-medium">{question}</p>
                        <Textarea
                          value={answers[index] || ''}
                          onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                          placeholder="Enter your answer..."
                          className="min-h-[100px]"
                        />
                      </div>
                    ))}
                    <Button 
                      className="w-full"
                      onClick={handleAnalyze}
                      disabled={Object.keys(answers).length < questions.length}
                    >
                      Analyze Responses
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card className="bg-[#0f0f43] border-none">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white">Response Analysis</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-500/10 p-4 rounded-lg">
                      <p className="text-gray-300">{analysis}</p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Interview Responses:</h3>
                      {questions.map((question, index) => (
                        <div key={index} className="bg-[#1a1a4a] p-4 rounded-lg">
                          <p className="text-white font-medium">{question}</p>
                          <p className="text-white mt-2">{answers[index]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="next-steps">
            <Card className="bg-[#0f0f43] border-none">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white">Recommended Next Steps</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 bg-[#1a1a4a] p-4 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <span className="text-blue-400 font-medium">{index + 1}</span>
                        </div>
                        <p className="text-gray-300">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}