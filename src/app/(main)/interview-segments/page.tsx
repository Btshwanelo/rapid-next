'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';

interface Segment {
  name: string;
  isSelected: boolean;
}

export default function SegmentSelection() {
  // Predefined segments
  const [segments, setSegments] = useState<Segment[]>([
    { name: "Freelance Designers", isSelected: false },
    { name: "Developers", isSelected: false },
    { name: "Event Planners", isSelected: false },
    { name: "Accountants", isSelected: false },
    { name: "Content Writers", isSelected: false },
    { name: "Social Media Managers", isSelected: false },
    { name: "UI/UX Designers", isSelected: false },
    { name: "Project Managers", isSelected: false },
  ]);

  // Custom segment form state
  const [newSegment, setNewSegment] = useState({
    name: '',
    explanation: ''
  });

  // Track if custom segment form is visible
  const [isAddingSegment, setIsAddingSegment] = useState(false);

  // Count selected segments
  const selectedCount = segments.filter(seg => seg.isSelected).length;

  const toggleSegment = (index: number) => {
    if (segments[index].isSelected || selectedCount < 2) {
      const newSegments = [...segments];
      newSegments[index] = {
        ...newSegments[index],
        isSelected: !newSegments[index].isSelected
      };
      setSegments(newSegments);
    }
  };

  const handleAddSegment = () => {
    if (newSegment.name && newSegment.explanation) {
      setSegments([...segments, { name: newSegment.name, isSelected: false }]);
      setNewSegment({ name: '', explanation: '' });
      setIsAddingSegment(false);
    }
  };

  return (
    <div className="flex  items-start justify-center bg-none  ">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-2 text-white">Who do you want to interview?</h1>
        <p className="text-gray-300 text-center mb-8">Select 2-3 segments that best match your research needs</p>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white">Choose from suggested segments</h2>
          <div className="flex flex-wrap gap-2">
            {segments.map((segment, index) => (
              <Button
                key={segment.name}
                variant={segment.isSelected ? "default" : "outline"}
                className={`rounded-full ${
                  segment.isSelected 
                    ? "bg-blue-500 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => toggleSegment(index)}
              >
                {segment.name}
              </Button>
            ))}
          </div>
        </div>

        {!isAddingSegment ? (
          <div className="flex justify-start mb-6">
            <Button 
              variant="outline"
              onClick={() => setIsAddingSegment(true)}
              className="text-gray-600"
            >
              + Add custom segment
            </Button>
          </div>
        ) : (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Input
                  placeholder="Enter segment name (e.g., Freelance Photographers)"
                  value={newSegment.name}
                  onChange={(e) => setNewSegment({...newSegment, name: e.target.value})}
                  className="rounded-md"
                />
                <Textarea
                  placeholder="Why this segment? (Brief explanation)"
                  value={newSegment.explanation}
                  onChange={(e) => setNewSegment({...newSegment, explanation: e.target.value})}
                  className="rounded-md"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddSegment}
                    className="bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Add Segment
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsAddingSegment(false);
                      setNewSegment({ name: '', explanation: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Link href={'/interview-segments/personas'} >
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            disabled={selectedCount < 1}
            >
            Continue to Questions
          </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
