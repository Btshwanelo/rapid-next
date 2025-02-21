'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Interview {
  id: string;
  segment: string;
  date: string;
  status: 'complete' | 'incomplete';
  notes: string;
}

export default function InterviewDashboard() {
  const [selectedSegment, setSelectedSegment] = useState("all");
  
  const segments = [
    "All Segments",
    "Freelance Designers",
    "Developers",
    "Event Planners"
  ];

  const interviews: Interview[] = [
    {
      id: '1',
      segment: 'Freelance Designers',
      date: '2025-01-22',
      status: 'incomplete',
      notes: 'Discussed user flow, pain points...'
    },
    {
      id: '2',
      segment: 'Developers',
      date: '2025-01-24',
      status: 'incomplete',
      notes: 'Scheduled but not finished. Wi...'
    },
    {
      id: '3',
      segment: 'Event Planners',
      date: '2025-01-28',
      status: 'complete',
      notes: 'Talked about scheduling comple...'
    }
  ];

  const totalInterviews = 5;
  const completedInterviews = interviews.filter(i => i.status === 'complete').length;
  const progressPercent = (completedInterviews / totalInterviews) * 100;

  return (
    <div className="min-h-screen  p-6">
      <div className=" mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Interview Overview</h1>

        {/* Progress Card */}
        <Card className="bg-[#0f0f43] border-none">
          <CardContent className="pt-6">
            <p className="text-gray-300 mb-3">
              You have completed {completedInterviews} out of {totalInterviews} planned interviews.
            </p>
            <Progress value={progressPercent} className="h-2" />
          </CardContent>
        </Card>

        {/* Interviews Section */}
        <Card className='bg-[#0f0f43] border-none'>
          <CardContent className="pt-6">
            <Tabs defaultValue="all" className="space-y-6 ">
              <TabsList className="space-x-2 bg-[#0f0f43] p-1">
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

              {segments.map((segment) => (
                <TabsContent
                  key={segment}
                  value={segment.toLowerCase().replace(' ', '-')}
                >
                  <Table className='text-gray-300'>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Segment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[300px]">Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {interviews
                        .filter(interview => 
                          segment === "All Segments" || 
                          interview.segment === segment
                        )
                        .map((interview) => (
                          <TableRow key={interview.id}>
                            <TableCell className="font-medium">
                              {interview.segment}
                            </TableCell>
                            <TableCell>{interview.date}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  interview.status === 'complete'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                }
                              >
                                {interview.status === 'complete' ? 'Complete' : 'Incomplete'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-400">
                              {interview.notes}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" className='text-gray-700' size="sm">
                                Toggle Status
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button className="bg-black text-white hover:bg-gray-800">
            Add New Interview
          </Button>
          <Button variant="outline" className="bg-gray-200">
            Analyze Interviews
          </Button>
        </div>
      </div>
    </div>
  );
}