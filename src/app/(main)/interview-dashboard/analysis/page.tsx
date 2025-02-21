'use client'
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ThemeKeyword {
  text: string;
  count: number;
}

interface SentimentData {
  type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  count: number;
  percentage: number;
}

interface SegmentAnalysis {
  segment: string;
  themes: ThemeKeyword[];
  sentiment: SentimentData[];
  painPoints: string[];
  recommendations: string[];
  followUpQuestion: string;
}

export default function InterviewAnalysis() {
  const segments = ["All Segments", "Freelance Designers", "Developers", "Event Planners"];
  
  const analysisData: SegmentAnalysis = {
    segment: "Freelance Designers",
    themes: [
      { text: "Late Payments", count: 3 },
      { text: "Manual Tracking", count: 3 },
      { text: "Client Communication", count: 1 }
    ],
    sentiment: [
      { type: 'POSITIVE', count: 1, percentage: 20 },
      { type: 'NEGATIVE', count: 2, percentage: 40 },
      { type: 'NEUTRAL', count: 2, percentage: 40 }
    ],
    painPoints: [
      "Late Payments mentioned 3 times.",
      "Manual Tracking mentioned 3 times.",
      "Client Communication mentioned 1 time."
    ],
    recommendations: [
      "We see that \"Late Payments\" is frequently mentioned (3 times). Consider addressing it with a dedicated feature or deeper questions.",
      "Negative sentiment is higher than positive. Consider revisiting core assumptions or pivoting."
    ],
    followUpQuestion: "Would an automated email feature that alerts clients 3 days before the due date be appealing?"
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-white">Analysis & Insights</h1>

        <Tabs defaultValue="all-segments" className="space-y-6">
          <TabsList className="p-1 space-x-2 bg-[#0f0f43]">
            {segments.map((segment) => (
              <TabsTrigger
                key={segment}
                value={segment.toLowerCase().replace(' ', '-')}
                className="data-[state=active]:bg-blue-600"
              >
                {segment}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all-segments">
            {/* Themes/Keywords Section */}
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">Themes / Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {analysisData.themes.map((theme) => (
                    <Badge
                      key={theme.text}
                      variant="secondary"
                      className="py-2 px-4 bg-gray-100"
                    >
                      {theme.text} ({theme.count})
                    </Badge>
                  ))}
                </div>
              </section>

              {/* Sentiment Overview */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">Sentiment Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysisData.sentiment.map((item) => (
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
                  {analysisData.painPoints.map((point, index) => (
                    <li key={index} className="text-gray-300">{point}</li>
                  ))}
                </ul>
              </section>

              {/* Recommendations */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">Recommendations</h2>
                <ul className="space-y-3 list-disc pl-5">
                  {analysisData.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-300">{rec}</li>
                  ))}
                </ul>

                <Card className="mt-4 bg-gray-50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Recommended Follow-up Question:</h3>
                    <p className="text-gray-700">{analysisData.followUpQuestion}</p>
                  </CardContent>
                </Card>
              </section>
            </div>
          </TabsContent>
          
          {/* Add similar TabsContent for other segments */}
        </Tabs>
      </div>
    </div>
  );
}