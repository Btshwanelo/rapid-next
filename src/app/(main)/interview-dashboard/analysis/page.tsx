'use client'
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLazyGetInterviewSegmentsByProjectQuery } from '@/services/interviewService';
import useProject from '@/hooks/useProject';
import useAuth from '@/hooks/useAuth';

// Define the interview data structure based on the API response
interface InterviewData {
  _id: string;
  title: string;
  description: string;
  questions: string[];
  keywords: string;
  sentimentsOverview: string;
  painPoints: string[];
  recommendations: string[];
  recommendedFollowupQuestion: string;
  interviewAnalysis: {
    positive: number;
    negative: number;
    neutral: number;
  };
  projectId: string;
  createdAt: string;
}

export default function InterviewAnalysis() {
  const [activeTab, setActiveTab] = useState<string>('all-segments');
  const [segments, setSegments] = useState<any>(['All Segments']);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
console.log("1212",segments)
console.log("121w3e2",interviewData)
  const projectDetails = useProject();
  const authDetails = useAuth();

  const [getInterviewSegments, getSegmentsProps] = useLazyGetInterviewSegmentsByProjectQuery();

  // Fetch interview data when component mounts
  useEffect(() => {
    if (projectDetails?._id && authDetails?.token) {
      fetchInterviewData();
    }
  }, [projectDetails?._id, authDetails?.token]);

  // Process data when API response changes
  useEffect(() => {
    if (getSegmentsProps.isLoading) {
      setIsLoading(true);
    } else if (getSegmentsProps.isError) {
      setIsLoading(false);
      setError('Failed to load interview data. Please try again.');
    } else if (getSegmentsProps.isSuccess && getSegmentsProps.data) {
      setIsLoading(false);
      setError(null);
      
      const data = getSegmentsProps.data.data || [];
      setInterviewData(data);
      
      // Extract unique segment titles to use as tabs
      if (data.length > 0) {
        const uniqueSegments = [...new Set(data.map((item:any) => item.title))];
        setSegments(uniqueSegments);
      }
    }
  }, [getSegmentsProps.data, getSegmentsProps.isLoading, getSegmentsProps.isError, getSegmentsProps.isSuccess]);

  const fetchInterviewData = () => {
    if (!projectDetails?._id || !authDetails?.token) return;
    
    getInterviewSegments({
      id: projectDetails._id,
      authToken: authDetails.token
    });
  };

  // Get the current interview data based on selected tab
  const getCurrentData = (): InterviewData | null => {
    if (interviewData.length === 0) return null;
    
    if (activeTab === 'all-segments' || activeTab === 'all-segments-tab') {
      return interviewData[0]; // Default to first interview for "All Segments"
    }
    
    // Find the interview that matches the active tab
    const selected = interviewData.find(item => 
      item.title.toLowerCase().replace(/\s+/g, '-') === activeTab
    );
    
    return selected || interviewData[0];
  };

  // Get keywords as an array of objects with text and count (if available)
  const getKeywords = (data: InterviewData | null) => {
    if (!data) return [];
    
    // Split keywords by commas and clean up
    const keywordList = data.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    // Return as array of objects (without count since API doesn't provide it)
    return keywordList.map(text => ({ text, count: 1 }));
  };

  // Get sentiment data in the format needed for UI
  const getSentimentData = (data: InterviewData | null) => {
    if (!data || !data.interviewAnalysis) return [];
    
    const { positive, negative, neutral } = data.interviewAnalysis;
    const total = positive + negative + neutral;
    
    return [
      { type: 'POSITIVE' as const, count: Math.round((positive / 100) * total), percentage: positive },
      { type: 'NEGATIVE' as const, count: Math.round((negative / 100) * total), percentage: negative },
      { type: 'NEUTRAL' as const, count: Math.round((neutral / 100) * total), percentage: neutral }
    ];
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Get the pain points with counts (if available)
  const getPainPoints = (data: InterviewData | null) => {
    if (!data || !data.painPoints) return [];
    return data.painPoints.map(point => `${point}.`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-white">Loading interview analysis...</p>
      </div>
    );
  }

  if (error || interviewData.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="bg-[#0f0f43] p-6 rounded-lg">
          <p className="text-red-400">{error || 'No interview data available.'}</p>
          <Link href="/interview-dashboard" className="text-blue-400 flex items-center mt-4">
            <ArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentData = getCurrentData();
  const keywords = getKeywords(currentData);
  const sentimentData = getSentimentData(currentData);
  const painPoints = getPainPoints(currentData);
  
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto space-y-8">
        <Link href="/interview-dashboard" className="flex text-gray-400 mb-2">
          <ArrowLeft className="text-gray-400 mr-1" /> back
        </Link>
        <h1 className="text-2xl font-bold text-white">Analysis & Insights</h1>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="p-1 space-x-2 bg-[#0f0f43]">
            {segments.map((segment:any) => (
              <TabsTrigger
                key={segment}
                value={segment.toLowerCase().replace(/\s+/g, '-')}
                className="data-[state=active]:bg-blue-600"
              >
                {segment}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Main content - we'll use a single TabsContent that updates based on the active tab */}
          <TabsContent value={activeTab}>
            {currentData && (
              <div className="space-y-6">
                {/* Themes/Keywords Section */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-white">Themes / Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="py-2 px-4 bg-gray-100"
                      >
                        {keyword.text}
                      </Badge>
                    ))}
                  </div>
                </section>

                {/* Sentiment Overview */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-white">Sentiment Overview</h2>
                  <p className="text-gray-300 mb-4">{currentData.sentimentsOverview}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sentimentData.map((item) => (
                      <Card key={item.type} className={`
                        ${item.type === 'POSITIVE' ? 'bg-green-50' : ''}
                        ${item.type === 'NEGATIVE' ? 'bg-red-50' : ''}
                        ${item.type === 'NEUTRAL' ? 'bg-gray-50' : ''}
                      `}>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-1">{item.type}</h3>
                          <p className="text-gray-600">{item.count} Interview(s)</p>
                          <p className="text-2xl font-bold mt-2">{item.percentage}%</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Pain Points */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-white">Pain Points</h2>
                  <ul className="space-y-2 list-disc pl-5">
                    {painPoints.map((point, index) => (
                      <li key={index} className="text-gray-300">{point}</li>
                    ))}
                  </ul>
                </section>

                {/* Recommendations */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-white">Recommendations</h2>
                  <ul className="space-y-3 list-disc pl-5">
                    {currentData.recommendations.map((rec, index) => (
                      <li key={index} className="text-gray-300">{rec}</li>
                    ))}
                  </ul>

                  <Card className="mt-4 bg-gray-50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Recommended Follow-up Question:</h3>
                      <p className="text-gray-700">{currentData.recommendedFollowupQuestion}</p>
                    </CardContent>
                  </Card>
                </section>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}