'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import Link from 'next/link';

// Sample interview questions
const SAMPLE_QUESTIONS = [
  "What's your biggest challenge in your current role?",
  "How do you typically start your workday?",
  "What tools or applications do you use most frequently?",
  "What's your preferred method of communication at work?",
  "How do you handle stress in your work environment?",
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

interface PersonaDetailPageProps {
  persona: Persona;
}

export default function PersonaDetailPage() {
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
  const [showInterview, setShowInterview] = useState(false);
  const [interviewStep, setInterviewStep] = useState<'identify' | 'question' | 'analyze' | 'next'>('identify');
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [responses, setResponses] = useState<{ question: string; answer: string }[]>([]);

  const startInterview = () => {
    setShowInterview(true);
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setInterviewStep('question');
      setLoading(false);
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (!response.trim()) return;

    // Save current response
    setResponses([
      ...responses,
      {
        question: SAMPLE_QUESTIONS[currentQuestionIndex],
        answer: response
      }
    ]);

    // Clear current response
    setResponse('');

    if (currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Show analysis
      setLoading(true);
      setInterviewStep('analyze');
      // Simulate analysis delay
      setTimeout(() => {
        setInterviewStep('next');
        setLoading(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNextQuestion();
    }
  };

  return (
    <div className="min-h-screen space-y-8 p-6">
      {/* Header Section */}
      <Link href={'/interview-segments/personas'} className='flex text-gray-400 mb-2'>
          {/* <Button variant={'ghost'}> */}
           <ArrowLeft className='text-gray-400 mr-1' /> back
          </Link>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-2 border-blue-500">
            <AvatarImage src={persona.avatarUrl} alt={persona.name} />
            <AvatarFallback>{persona.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-white">{persona.name}</h1>
            <p className="text-gray-400">{persona.occupation}</p>
          </div>
        </div>
        <Link href={'/personas/1/interview'}>
        {/* <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={startInterview}
          >
          <MessageCircle className="mr-2 h-4 w-4" />
          Start Interview
        </Button> */}
          </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="bg-[#0f0f43] border-none">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300">{persona.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Age" value={persona.age.toString()} />
            <InfoCard label="Gender" value={persona.gender} />
            <InfoCard label="Occupation" value={persona.occupation} />
            <InfoCard label="Education" value={persona.education} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <DetailCard 
            label="Personality Traits" 
            value={persona.personalityTraits} 
          />
          <DetailCard 
            label="Goals and Motivations" 
            value={persona.goalsAndMotivations} 
          />
          <DetailCard 
            label="Challenges and Pain Points" 
            value={persona.challengesAndPainPoints} 
          />
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-2 gap-6">
        <DetailCard 
          label="Technology Usage" 
          value={persona.technologyUsage} 
        />
        <DetailCard 
          label="Preferred Communication" 
          value={persona.preferredCommunication} 
        />
        <DetailCard 
          label="Brands and Products" 
          value={persona.brandsAndProducts} 
        />
        <DetailCard 
          label="Visual Elements" 
          value={persona.visualElements} 
        />
        <DetailCard 
          label="A Day in the Life" 
          value={persona.dayInLife} 
        />
        <DetailCard 
          label="Quotes" 
          value={persona.quotes} 
        />
      </div>

      {/* Interview Dialog */}
      <Dialog open={showInterview} onOpenChange={setShowInterview}>
        <DialogContent className="sm:max-w-xl bg-[#0f0f43] text-white">
          <DialogHeader>
            <DialogTitle>Interview with {persona.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {interviewStep === 'identify' && 'Identifying interview context...'}
              {interviewStep === 'question' && `Question ${currentQuestionIndex + 1} of ${SAMPLE_QUESTIONS.length}`}
              {interviewStep === 'analyze' && 'Analyzing responses...'}
              {interviewStep === 'next' && 'Interview Summary'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {interviewStep === 'question' && (
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 p-4 rounded-lg">
                      <p className="text-blue-300">{SAMPLE_QUESTIONS[currentQuestionIndex]}</p>
                    </div>
                    <div>
                      <Label htmlFor="response">Response</Label>
                      <Input
                        id="response"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="mt-2"
                        placeholder="Enter response... (Press Enter to submit)"
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handleNextQuestion}
                      disabled={!response.trim()}
                    >
                      {currentQuestionIndex < SAMPLE_QUESTIONS.length - 1 ? (
                        <>Next Question <ArrowRight className="ml-2 h-4 w-4" /></>
                      ) : (
                        'Complete Interview'
                      )}
                    </Button>
                  </div>
                )}

                {interviewStep === 'next' && (
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-4">Interview Summary</h3>
                      {responses.map((item, index) => (
                        <div key={index} className="mb-4">
                          <p className="text-blue-300 font-medium">{item.question}</p>
                          <p className="text-gray-300 mt-1">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => setShowInterview(false)}
                    >
                      Close Interview
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper Components
const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <Card className="bg-[#0f0f43] border-none">
    <CardContent className="p-4">
      <Label className="text-gray-400">{label}</Label>
      <p className="text-white mt-1 font-medium">{value}</p>
    </CardContent>
  </Card>
);

const DetailCard = ({ label, value }: { label: string; value: string }) => (
  <Card className="bg-[#0f0f43] border-none">
    <CardContent className="p-4">
      <Label className="text-white font-semibold">{label}</Label>
      <p className="text-gray-300 mt-2">{value}</p>
    </CardContent>
  </Card>
);