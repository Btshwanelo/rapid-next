'use client'
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, Sparkles } from 'lucide-react';

type Persona = {
  id: string;
  name: string;
  description: string;
};

type EmpathyPoint = {
  id: string;
  content: string;
};

type EmpathySection = {
  thinks: EmpathyPoint[];
  sees: EmpathyPoint[];
  says: EmpathyPoint[];
  hears: EmpathyPoint[];
};

type EmpathyData = {
  user: EmpathySection;
  ai: EmpathySection;
  combined: EmpathySection;
};

const PERSONAS: Persona[] = [
  {
    id: "2",
    name: "Power User",
    description: "Experienced user with advanced needs"
  },
  {
    id: "3",
    name: "Admin",
    description: "System administrator with full access"
  },
  {
    id: "4",
    name: "Support Staff",
    description: "Customer service representative"
  }
];

const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

const createEmptySection = (): EmpathySection => ({
  thinks: [],
  sees: [],
  says: [],
  hears: [],
});

const getMockDataForPersona = (personaId: string): EmpathySection => {
  const mockData: Record<string, EmpathySection> = {
    "1": {
      thinks: [
        { id: generateUniqueId(), content: "How do I get started?" },
        { id: generateUniqueId(), content: "Will this be hard to learn?" }
      ],
      sees: [
        { id: generateUniqueId(), content: "Clean interface" },
        { id: generateUniqueId(), content: "Tutorial prompts" }
      ],
      says: [
        { id: generateUniqueId(), content: "I need help with this" },
        { id: generateUniqueId(), content: "Where is the documentation?" }
      ],
      hears: [
        { id: generateUniqueId(), content: "It's user-friendly" },
        { id: generateUniqueId(), content: "Support is helpful" }
      ]
    },
    "2": {
      thinks: [
        { id: generateUniqueId(), content: "Need more advanced features" },
        { id: generateUniqueId(), content: "How can I automate this?" }
      ],
      sees: [
        { id: generateUniqueId(), content: "Advanced settings" },
        { id: generateUniqueId(), content: "Power user tools" }
      ],
      says: [
        { id: generateUniqueId(), content: "This could be more efficient" },
        { id: generateUniqueId(), content: "Let me customize this" }
      ],
      hears: [
        { id: generateUniqueId(), content: "New features coming soon" },
        { id: generateUniqueId(), content: "Performance improvements" }
      ]
    },
    "3": {
      thinks: [
        { id: generateUniqueId(), content: "System security is crucial" },
        { id: generateUniqueId(), content: "Need to monitor usage" }
      ],
      sees: [
        { id: generateUniqueId(), content: "Admin dashboard" },
        { id: generateUniqueId(), content: "System logs" }
      ],
      says: [
        { id: generateUniqueId(), content: "We need better controls" },
        { id: generateUniqueId(), content: "Let me check the logs" }
      ],
      hears: [
        { id: generateUniqueId(), content: "Security concerns" },
        { id: generateUniqueId(), content: "User feedback" }
      ]
    },
    "4": {
      thinks: [
        { id: generateUniqueId(), content: "How can I help users better?" },
        { id: generateUniqueId(), content: "Common user problems" }
      ],
      sees: [
        { id: generateUniqueId(), content: "Support tickets" },
        { id: generateUniqueId(), content: "User interactions" }
      ],
      says: [
        { id: generateUniqueId(), content: "Let me help you with that" },
        { id: generateUniqueId(), content: "Have you tried this?" }
      ],
      hears: [
        { id: generateUniqueId(), content: "User frustrations" },
        { id: generateUniqueId(), content: "Feature requests" }
      ]
    }
  };

  return mockData[personaId] || createEmptySection();
};

const EmpathyMapToBe = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'ai' | 'combined'>('user');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string>(PERSONAS[0].id);
  const [empathyData, setEmpathyData] = useState<EmpathyData>({
    user: createEmptySection(),
    ai: createEmptySection(),
    combined: createEmptySection(),
  });

  const generateAIEmpathy = () => {
    const aiData = getMockDataForPersona(selectedPersona);
    setEmpathyData(prev => ({
      ...prev,
      ai: aiData,
      combined: {
        thinks: [...prev.user.thinks, ...aiData.thinks],
        sees: [...prev.user.sees, ...aiData.sees],
        says: [...prev.user.says, ...aiData.says],
        hears: [...prev.user.hears, ...aiData.hears],
      }
    }));
  };

  const addEmpathyPoint = (category: keyof EmpathySection) => {
    const newPoint = {
      id: generateUniqueId(),
      content: "",
    };

    setEmpathyData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [category]: [...prev[activeTab][category], newPoint]
      }
    }));
  };

  const updateEmpathyPoint = (category: keyof EmpathySection, id: string, newContent: string) => {
    setEmpathyData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [category]: prev[activeTab][category].map(point =>
          point.id === id ? { ...point, content: newContent } : point
        )
      }
    }));
  };

  const deleteEmpathyPoint = (category: keyof EmpathySection, id: string) => {
    setEmpathyData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [category]: prev[activeTab][category].filter(point => point.id !== id)
      }
    }));
  };

  const renderEmpathySection = (title: string, category: keyof EmpathySection) => (
    <Card className="h-64">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {isEditing && activeTab !== 'combined' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => addEmpathyPoint(category)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2 overflow-y-auto max-h-48">
        <div className="grid grid-cols-2 gap-3">
          {empathyData[activeTab][category].map((point) => (
            <div 
              key={point.id} 
              className="group relative"
            >
              {isEditing && activeTab !== 'combined' ? (
                <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-card">
                  <Input
                    value={point.content}
                    onChange={(e) => updateEmpathyPoint(category, point.id, e.target.value)}
                    className="flex-1"
                    placeholder="Enter your insight..."
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEmpathyPoint(category, point.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-secondary/80">
                  <p className="text-sm">{point.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full  mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Empathy Map To Be</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedPersona}  onValueChange={setSelectedPersona}>
            <SelectTrigger className="max-w-[250px]" >
              <SelectValue placeholder="Select persona"  />
            </SelectTrigger>
            <SelectContent>
              {PERSONAS.map(persona => (
                <SelectItem 
                  key={persona.id} 
                  value={persona.id}
                  className="flex flex-col"
                >
                  <span className="font-medium">{persona.name}</span>
                  {/* <span className="text-sm text-muted-foreground">{persona.description}</span> */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeTab === 'user' && (
            <Button
              variant="default"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Map
                </>
              )}
            </Button>
          )}
          {activeTab === 'ai' && (
            <Button
              variant="default"
              onClick={generateAIEmpathy}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Insights
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab}  onValueChange={(value: string) => setActiveTab(value as 'user' | 'ai' | 'combined')} className="w-full">
        <TabsList className="mb-6" >
          <TabsTrigger value="user">User Generated</TabsTrigger>
          <TabsTrigger value="ai">AI Generated</TabsTrigger>
          <TabsTrigger value="combined">Combined View</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-2 gap-6">
          {renderEmpathySection('Thinks & Feels', 'thinks')}
          {renderEmpathySection('Sees', 'sees')}
          {renderEmpathySection('Says & Does', 'says')}
          {renderEmpathySection('Hears', 'hears')}
        </div>
      </Tabs>
    </div>
  );
};

export default EmpathyMapToBe;