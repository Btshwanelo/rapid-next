'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Brain, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useInitilizeJourneyMutation, useLazyGetJourneyAsIsByProjectIdQuery, useUpdateJourneyAsIsMutation } from '@/services/journeyService';

interface JourneyCard {
  id: string;
  content: string;
  type: 'doing' | 'thinking' | 'feeling';
  phaseIndex: number;
}

interface Phase {
  id: string;
  title: string;
}

export default function JourneyMapPage() {
  const [activeTab, setActiveTab] = useState<'user' | 'ai' | 'combined'>('user');
  const [phases, setPhases] = useState<Phase[]>([
    { id: '1', title: 'Awareness Phase' },
    { id: '2', title: 'Consideration Phase' },
    { id: '3', title: 'Engagement Phase' },
    { id: '4', title: 'Action Phase' },
    { id: '5', title: 'Evaluation Phase' },
    { id: '6', title: 'Feedback Phase' },
  ]);
  const [cards, setCards] = useState<JourneyCard[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<'doing' | 'thinking' | 'feeling'>('doing');
  const [newCardContent, setNewCardContent] = useState('');
  const [loading, setLoading] = useState(false);

  const [InitilizeJourney,initJourneyProps] = useInitilizeJourneyMutation()
  const [UpdateJourney,updateJourneyProps] = useUpdateJourneyAsIsMutation()
  const [GetJourneyByProject,getJourneyProps] = useLazyGetJourneyAsIsByProjectIdQuery()

  const handleAddCard = () => {
    if (!newCardContent.trim()) return;

    const newCard: JourneyCard = {
      id: Date.now().toString(),
      content: newCardContent,
      type: selectedType,
      phaseIndex: selectedPhase,
    };

    setCards([...cards, newCard]);
    setNewCardContent('');
    setShowAddCard(false);
  };

  const handleGenerateAI = async (phaseIndex: number, type: 'doing' | 'thinking' | 'feeling') => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCard: JourneyCard = {
      id: Date.now().toString(),
      content: `AI Generated content for ${phases[phaseIndex].title} - ${type}`,
      type,
      phaseIndex,
    };

    setCards([...cards, newCard]);
    setLoading(false);
  };

  const deleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Journey Map As Is</h1>
          <p className="text-gray-400 mt-2">Map out the user journey phases</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'user' ? 'default' : 'outline'}
            onClick={() => setActiveTab('user')}
          >
            USER CREATED
          </Button>
          <Button 
            variant={activeTab === 'ai' ? 'default' : 'outline'}
            onClick={() => setActiveTab('ai')}
          >
            AI GENERATED
          </Button>
          <Button 
            variant={activeTab === 'combined' ? 'default' : 'outline'}
            onClick={() => setActiveTab('combined')}
          >
            COMBINED
          </Button>
        </div>
      </div>

      {/* Journey Map Grid */}
      <div className="">
        <div className="">
          {/* Phase Headers */}
          <div className="grid grid-cols-6 gap-4 mb-4">
            {phases.map((phase, index) => (
              <div key={phase.id} className="w-64">
                <h3 className="text-lg font-semibold text-white mb-2">{phase.title}</h3>
              </div>
            ))}
          </div>

          {/* Doing Row */}
          <div className="mb-8">
            <h4 className="text-white font-medium mb-4">Doing</h4>
            <div className="grid grid-cols-6 gap-4">
              {phases.map((phase, phaseIndex) => (
                <div key={`doing-${phase.id}`} className="min-w-10 space-y-2">
                  {cards
                    .filter(card => card.phaseIndex === phaseIndex && card.type === 'doing')
                    .map(card => (
                      <Card key={card.id} className="bg-[#0f0f43] border-none group">
                        <CardContent className="p-4 relative">
                          <p className="text-gray-200">{card.content}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteCard(card.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className=" text-white border border-dashed border-gray-600 hover:border-blue-500"
                      onClick={() => {
                        setSelectedPhase(phaseIndex);
                        setSelectedType('doing');
                        setShowAddCard(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                    {/* <Button
                      variant="ghost"
                      className="border text-white border-dashed border-gray-600 hover:border-blue-500"
                      onClick={() => handleGenerateAI(phaseIndex, 'doing')}
                      disabled={loading}
                    >
                      <Brain className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thinking Row */}
          <div className="mb-8">
            <h4 className="text-white font-medium mb-4">Thinking</h4>
            <div className="grid grid-cols-6 gap-4">
              {phases.map((phase, phaseIndex) => (
                <div key={`thinking-${phase.id}`} className="min-w-10 space-y-2">
                  {cards
                    .filter(card => card.phaseIndex === phaseIndex && card.type === 'thinking')
                    .map(card => (
                      <Card key={card.id} className="bg-[#0f0f43] border-none group">
                        <CardContent className="p-4 relative">
                          <p className="text-gray-200">{card.content}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteCard(card.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className=" text-white border border-dashed border-gray-600 hover:border-blue-500"
                      onClick={() => {
                        setSelectedPhase(phaseIndex);
                        setSelectedType('thinking');
                        setShowAddCard(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                    {/* <Button
                      variant="ghost"
                      className="border text-white border-dashed border-gray-600 hover:border-blue-500"
                      onClick={() => handleGenerateAI(phaseIndex, 'thinking')}
                      disabled={loading}
                    >
                      <Brain className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feeling Row */}
          <div className='mb-10'>
            <h4 className="text-white font-medium mb-4">Feeling</h4>
            <div className="grid grid-cols-6 gap-4">
              {phases.map((phase, phaseIndex) => (
                <div key={`feeling-${phase.id}`} className="min-w-10 space-y-2">
                  {cards
                    .filter(card => card.phaseIndex === phaseIndex && card.type === 'feeling')
                    .map(card => (
                      <Card key={card.id} className="bg-[#0f0f43] border-none group">
                        <CardContent className="p-4 relative">
                          <p className="text-gray-200">{card.content}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteCard(card.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className=" text-white border border-dashed border-gray-600 hover:border-blue-500"
                      onClick={() => {
                        setSelectedPhase(phaseIndex);
                        setSelectedType('feeling');
                        setShowAddCard(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                    {/* <Button
                      variant="ghost"
                      className="border text-white border-dashed border-gray-600 hover:border-blue-500"
                      onClick={() => handleGenerateAI(phaseIndex, 'feeling')}
                      disabled={loading}
                    >
                      <Brain className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Card Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="sm:max-w-md ">
          <DialogHeader>
            <DialogTitle className="text-black">Add Journey Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Card Content</h4>
              <Textarea
                value={newCardContent}
                onChange={(e) => setNewCardContent(e.target.value)}
                placeholder="Enter card content..."
                className="h-32"
              />
            </div>
            <Button 
              className="w-full"
              onClick={handleAddCard}
              disabled={!newCardContent.trim()}
            >
              Add Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}