'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const SAMPLE_QUESTIONS = [
  "What are your main responsibilities in your current role?",
  "How do you typically approach problem-solving?",
  "What tools or software do you use most frequently?",
  "What's the biggest challenge you face in your work?",
  "How do you prefer to communicate with team members?",
];


const ClarifyingQuestions = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

    const [questions, setQuestions] = useState(SAMPLE_QUESTIONS);


  return (
    <div>
        <Card className="bg-[#0f0f43] border-none">
              <CardContent className="p-6 space-y-6">
                <Link href={'/problem-statement'} className='flex text-gray-400 mb-2'>
          {/* <Button variant={'ghost'}> */}
           <ArrowLeft className='text-gray-400 mr-1' /> back
          </Link>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Clarifying Questions</h2>
                  {/* <Button onClick={handleGenerateQuestions} disabled={loading}>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Questions
                  </Button> */}
                </div>

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
                      onClick={()=>console.log("submit")}
                      disabled={Object.keys(answers).length < questions.length}
                    >
                      Submit
                    </Button>
                  </div>
                
              </CardContent>
            </Card>
    </div>
  )
}

export default ClarifyingQuestions