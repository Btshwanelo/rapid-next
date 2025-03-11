'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Info, Edit2, X, Plus } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  text: string;
  segment: string;
}

interface Segment {
  name: string;
  questionCount: number;
}

export default function InterviewQuestions() {
  const [selectedSegment, setSelectedSegment] = useState<string>("Freelance Designers");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      text: "How do you typically handle design revision requests from clients?",
      segment: "Freelance Designers"
    },
    {
      id: '2',
      text: "What tools do you use to manage your design assets?",
      segment: "Freelance Designers"
    },
    {
      id: '3',
      text: "Tell me about your process for pricing design projects",
      segment: "Freelance Designers"
    }
  ]);

  const [segments] = useState<Segment[]>([
    { name: "Freelance Designers", questionCount: 3 },
    { name: "Developers", questionCount: 2 },
    { name: "Event Planners", questionCount: 2 }
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      const newQuestionObj = {
        id: Math.random().toString(36).substr(2, 9),
        text: newQuestion,
        segment: selectedSegment
      };
      setQuestions([...questions, newQuestionObj]);
      setNewQuestion("");
      setIsAddingQuestion(false);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="flex  items-start justify-center  rounded-xl p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-center mb-2 text-white">Interview Questions by Segment</h1>
        <p className="text-gray-300 text-center mb-8">Select a segment to view and manage its questions</p>

        {/* Segment Selection */}
        <div className="bg-[#0f0f43] rounded-lg p-4 mb-8 flex flex-wrap gap-4">
          {segments.map((segment) => (
            <Button
              key={segment.name}
              variant={selectedSegment === segment.name ? "default" : "outline"}
              className={`rounded-full ${
                selectedSegment === segment.name 
                  ? "bg-blue-600 text-white" 
                  : "bg-white"
              }`}
              onClick={() => setSelectedSegment(segment.name)}
            >
              <span className="mr-2">{segment.name}</span>
              <Badge variant="secondary" className="bg-white/20">
                {segment.questionCount}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {questions
            .filter(q => q.segment === selectedSegment)
            .map((question) => (
              <div
                key={question.id}
                className="flex items-center gap-3 p-4 bg-[#0f0f43] rounded-lg  transition-colors"
              >
                <span className="text-gray-500">◇</span>
                <p className="flex-grow text-gray-400">{question.text}</p>
               
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
        </div>

        {/* Add Question Input */}
        {isAddingQuestion ? (
          <div className="mt-4">
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder={`Add a new question for ${selectedSegment}...`}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddQuestion}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Add Question
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingQuestion(false);
                  setNewQuestion("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 mt-4 text-gray-500 hover:text-gray-700">
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => setIsAddingQuestion(true)}
            >
              <Plus className="h-4 w-4" />
              Add a new question for {selectedSegment}...
            </Button>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => setIsAddingQuestion(true)}
            >
              <Plus className="h-4 w-4" />
              Generate Using AI {selectedSegment}...
            </Button>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-end mt-8">
          <Link href={'/interview-dashboard'}>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
            Continue to interviews

          </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}