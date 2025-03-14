'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import useAuth from '@/hooks/useAuth'
import useProject from '@/hooks/useProject'
import { useLazyGetProblemByIdQuery, useUpdateProblemMutation } from '@/services/problemService'
import { useClarifyingQuestionsMutation } from '@/slices/autogenApiSlice'
import { extractQuestions } from '@/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

// Define interfaces for better type safety
interface Question {
  question: string;
  answer: string;
  _id?: string;
}

interface ProblemData {
  _id: string;
  clarifyingQuestions: Question[];
  [key: string]: any; // For other properties in the problem data
}

const ClarifyingQuestions = () => {
  // State to hold the questions and answers
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);
  const [hasGeneratedQuestions, setHasGeneratedQuestions] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading questions...");

  // Hooks for navigation and params
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // Auth and project hooks
  const authDetails = useAuth();
  const projectDetails = useProject();
  
  // API hooks
  const [updateProblem, updateProps] = useUpdateProblemMutation();
  const [getProblemById, getQuestionsProps] = useLazyGetProblemByIdQuery();
  const [clarifyingQuestions, clarifyingQuestionsProps] = useClarifyingQuestionsMutation();

  // Handle answer changes
  const handleAnswerChange = (index: number, value: string) => {
    // Create a deep copy to avoid modifying read-only objects
    const updatedQuestions = questions.map((q, i) => {
      if (i === index) {
        // Create a new object for the question being modified
        return { ...q, answer: value };
      }
      return { ...q }; // Create new objects for all questions to avoid reference issues
    });
    setQuestions(updatedQuestions);
  };

  // Generate questions when needed
  const handleGenerateQuestions = () => {
    setIsGeneratingQuestions(true);
    setLoadingMessage("Generating questions for you...");
    clarifyingQuestions({
      "message": "Our user is a coffee enthusiast. We will improve their overall coffee shop experience. Currently, this user struggles because finding a quiet place to work or relax in busy coffee shops is difficult. It's kinda like trying to focus while being surrounded by constant noise and distractions. In a perfect world, they would be able to enjoy a peaceful environment with good coffee and a comfortable seat, no matter the time of day. This would be great for the world because it would allow people to find balance and productivity in their daily routines while enjoying high-quality coffee in a welcoming atmosphere"
    });
  };

  // Save questions to the backend
  const handleSaveQuestions = (questionsToSave: Question[]) => {
    setIsSaving(true);
    setLoadingMessage("Saving questions...");
    updateProblem({
      body: { clarifyingQuestions: questionsToSave },
      id,
      authToken: authDetails.token
    });
  };

  // Submit answers
  const handleSubmitAnswers = () => {
    setIsSaving(true);
    
    // Format the questions to match the expected API structure
    const formattedQuestions = questions.map(q => ({
      question: q.question,
      answer: q.answer || "",
      _id: q._id
    }));
    
    updateProblem({
      body: { clarifyingQuestions: formattedQuestions },
      id,
      authToken: authDetails.token
    });
  };

  // Check if all questions have been answered
  const areAllQuestionsAnswered = () => {
    return questions.length > 0 && questions.every(q => q.answer && q.answer.trim() !== '');
  };

  // Initial fetch of problem data
  useEffect(() => {
    if (authDetails.token) {
      setIsLoading(true);
      setLoadingMessage("Loading your questions...");
      getProblemById({ id, authToken: authDetails.token });
    }
  }, [authDetails.token, id]);

  // Handle fetched problem data
  useEffect(() => {
    if (getQuestionsProps.isSuccess && getQuestionsProps.data) {
      const problemData = getQuestionsProps.data.data as ProblemData;
      
      if (problemData.clarifyingQuestions && problemData.clarifyingQuestions.length > 0) {
        // Create deep copies of the question objects to avoid read-only issues
        const questionsWithWritableProps = problemData.clarifyingQuestions.map(q => ({
          ...q,
          answer: q.answer || "",
          _id: q._id || ""
        }));
        setQuestions(questionsWithWritableProps);
        setHasGeneratedQuestions(true);
        setIsLoading(false);
      } else if (!hasGeneratedQuestions) {
        handleGenerateQuestions();
        setHasGeneratedQuestions(true);
      }
    } else if (getQuestionsProps.isError) {
      setIsLoading(false);
      setLoadingMessage("Failed to load questions. Please try again.");
    }
  }, [getQuestionsProps.isSuccess, getQuestionsProps.isError, getQuestionsProps.data]);

  // Handle questions generation response
  useEffect(() => {
    if (clarifyingQuestionsProps.isSuccess && clarifyingQuestionsProps.data) {
      const extractedQuestions = extractQuestions(clarifyingQuestionsProps.data);
      
      // Format questions for API
      const formattedQuestions = extractedQuestions.map(question => ({
        question: question.question,
        answer: "",
      }));
      
      setQuestions(formattedQuestions);
      handleSaveQuestions(formattedQuestions);
      setIsGeneratingQuestions(false);
    } else if (clarifyingQuestionsProps.isError) {
      setIsGeneratingQuestions(false);
      setIsLoading(false);
      setLoadingMessage("Failed to generate questions. Please try again.");
    }
  }, [clarifyingQuestionsProps.isSuccess, clarifyingQuestionsProps.isError, clarifyingQuestionsProps.data]);

  // Handle update response
  useEffect(() => {
    if (updateProps.isSuccess) {
      // Refresh the questions list if needed
      if (questions.length === 0) {
        getProblemById({ id, authToken: authDetails.token });
      }
      
      setIsSaving(false);
      // Optionally navigate to next page if all answers submitted
      if (areAllQuestionsAnswered()) {
        // router.push('/next-page'); // Uncomment to enable navigation after submission
      }
    } else if (updateProps.isError) {
      setIsSaving(false);
    }
  }, [updateProps.isSuccess, updateProps.isError]);

  // Determine if we should show loading state
  const showLoading = isLoading || isGeneratingQuestions;

  return (
    <div>
      <Card className="bg-[#0f0f43] border-none">
        <CardContent className="p-6 space-y-6">
          <Link href={'/problem-statement'} className='flex text-gray-400 mb-2'>
            <ArrowLeft className='text-gray-400 mr-1' /> back
          </Link>
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Clarifying Questions</h2>
            {isGeneratingQuestions && (
              <div className="flex items-center text-gray-300 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating questions...
              </div>
            )}
          </div>

          {showLoading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <span className="text-white font-medium">{loadingMessage}</span>
              <p className="text-gray-400 text-sm mt-2">This may take a moment...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.length > 0 ? (
                <>
                  {questions.map((question, index) => (
                    <div key={question._id || index} className="space-y-2">
                      <p className="text-white font-medium">{question.question}</p>
                      <Textarea
                        value={question.answer || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder="Enter your answer..."
                        className="min-h-[100px]"
                        disabled={isSaving}
                      />
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full relative"
                    onClick={handleSubmitAnswers}
                    disabled={!areAllQuestionsAnswered() || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving your answers...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <p>No questions available. Try refreshing the page.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setHasGeneratedQuestions(false);
                      handleGenerateQuestions();
                    }}
                  >
                    Generate Questions
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ClarifyingQuestions