'use client'
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Lightbulb, ThumbsUp, ThumbsDown, Sparkles, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';

interface Idea {
  id: string;
  title: string;
  description: string;
  methodology?: string;
  isAIGenerated: boolean;
  status: 'active' | 'rejected';
  category?: string;
  createdAt: Date;
}

const SCAMPER_PROMPTS = {
  'Substitute': 'What can you substitute in the current solution?',
  'Combine': 'What elements could you combine?',
  'Adapt': 'How could you adapt this for a different context?',
  'Modify': 'What could you modify or magnify?',
  'Put to another use': 'What other uses could this have?',
  'Eliminate': 'What could you eliminate or simplify?',
  'Reverse': 'What if you reversed the process or perspective?'
};

const ANALOGY_PROMPTS = {
  'Nature': 'How does nature solve similar problems?',
  'Different Industry': 'How do other industries handle this?',
  'Historical': 'How was this solved in the past?',
  'Personal': 'How do you handle similar situations in daily life?'
};

const MAPPING_PROMPTS = {
  'Central Theme': 'Whats the core concept?',
  'Branches': 'What are the main categories or aspects?',
  'Connections': 'How do these elements connect?',
  'Extensions': 'What are possible extensions or variations?'
};

const IdeasPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedMethodology, setSelectedMethodology] = useState<string>('');
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [newIdeaData, setNewIdeaData] = useState({
    title: '',
    description: '',
    category: ''
  });

  const handleAddIdea = (idea: Partial<Idea>) => {
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: idea.title || '',
      description: idea.description || '',
      methodology: idea.methodology,
      isAIGenerated: idea.isAIGenerated || false,
      status: 'active',
      category: idea.category,
      createdAt: new Date(),
    };

    setIdeas([...ideas, newIdea]);
    setShowAddDialog(false);
    setNewIdeaData({ title: '', description: '', category: '' });
  };

  const handleEditIdea = (updatedIdea: Idea) => {
    setIdeas(ideas.map(idea => 
      idea.id === updatedIdea.id ? updatedIdea : idea
    ));
    setEditingIdea(null);
  };

  const handleDeleteIdea = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  const handleRejectIdea = (id: string) => {
    setIdeas(ideas.map(idea =>
      idea.id === id ? { ...idea, status: 'rejected' } : idea
    ));
  };

  const handleKeepIdea = (id: string) => {
    setIdeas(ideas.map(idea =>
      idea.id === id ? { ...idea, status: 'active' } : idea
    ));
  };

  const getMethodologyPrompts = () => {
    switch (selectedMethodology) {
      case 'scamper':
        return SCAMPER_PROMPTS;
      case 'analogy':
        return ANALOGY_PROMPTS;
      case 'mapping':
        return MAPPING_PROMPTS;
      default:
        return {};
    }
  };

  // Simulated AI idea generation
  const generateIdeas = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const simulatedIdeas: Idea[] = [];
    
    // Generate 3 ideas based on methodology
    for (let i = 0; i < 3; i++) {
      simulatedIdeas.push({
        id: `ai-${Date.now()}-${i}`,
        title: `AI Generated Idea for ${selectedMethodology} #${i + 1}`,
        description: `This is a simulated AI-generated idea using the ${selectedMethodology} methodology based on your prompt: ${generationPrompt}`,
        methodology: selectedMethodology,
        isAIGenerated: true,
        status: 'active',
        createdAt: new Date(),
      });
    }
    
    setGeneratedIdeas(simulatedIdeas);
    setIsGenerating(false);
  };

  const renderIdeaCard = (idea: Idea) => (
    <Card key={idea.id} className={`w-full bg-[#0f0f43] text-white border-none ${idea.status === 'rejected' ? 'opacity-60' : ''}`}>
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            {idea.title}
            {idea.isAIGenerated && (
              <Badge variant="secondary" >
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
            )}
          </span>
          {idea.methodology && (
            <Badge variant="outline" className='text-white'>{idea.methodology}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className=" text-white">{idea.description}</p>
        {idea.category && (
          <Badge variant="outline" className="mt-2 text-white">
            {idea.category}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingIdea(idea)}
          >
            <Edit2 className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteIdea(idea.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
          <Link href={'/ideas/1'}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteIdea(idea.id)}
            >
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
            </Link>
        </div>
        {idea.isAIGenerated && (
          <div className="flex gap-2">
            {idea.status === 'active' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRejectIdea(idea.id)}
              >
                <ThumbsDown className="w-4 h-4 mr-1" /> Reject
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleKeepIdea(idea.id)}
              >
                <ThumbsUp className="w-4 h-4 mr-1" /> Keep
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Ideas Management</h1>
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Idea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Idea</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Idea Title"
                  value={newIdeaData.title}
                  onChange={e => setNewIdeaData({
                    ...newIdeaData,
                    title: e.target.value,
                  })}
                />
                <Textarea
                  placeholder="Idea Description"
                  className="h-32"
                  value={newIdeaData.description}
                  onChange={e => setNewIdeaData({
                    ...newIdeaData,
                    description: e.target.value,
                  })}
                />
                <Select
                  value={newIdeaData.category}
                  onValueChange={value => setNewIdeaData({
                    ...newIdeaData,
                    category: value,
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="process">Process</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => handleAddIdea(newIdeaData)} 
                  className="w-full"
                  disabled={!newIdeaData.title || !newIdeaData.description}
                >
                  Add Idea
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Lightbulb className="w-4 h-4 mr-2" /> Generate Ideas
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Ideas with AI</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  value={selectedMethodology}
                  onValueChange={(value) => {
                    setSelectedMethodology(value);
                    setGenerationPrompt('');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Methodology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scamper">SCAMPER</SelectItem>
                    <SelectItem value="analogy">Analogy Thinking</SelectItem>
                    <SelectItem value="mapping">Mind Mapping</SelectItem>
                  </SelectContent>
                </Select>

                {selectedMethodology && (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(getMethodologyPrompts()).map(([key, prompt]) => (
                      <Button
                        key={key}
                        variant="outline"
                        className="justify-start text-left h-auto py-2"
                        onClick={() => setGenerationPrompt(prompt)}
                      >
                        <div>
                          <div className="font-medium">{key}</div>
                          <div className="text-sm text-gray-500">{prompt}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}

                <Textarea
                  placeholder="Describe your problem or context for idea generation..."
                  className="h-32"
                  value={generationPrompt}
                  onChange={e => setGenerationPrompt(e.target.value)}
                />

                <Button
                  onClick={generateIdeas}
                  disabled={!selectedMethodology || !generationPrompt || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Generating Ideas...' : 'Generate Ideas'}
                </Button>

                {generatedIdeas.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Generated Ideas:</h3>
                    {generatedIdeas.map(idea => (
                      <Card key={idea.id} className="p-4">
                        <h4 className="font-medium">{idea.title}</h4>
                        <p className="text-sm text-gray-600 mt-2">{idea.description}</p>
                        <div className="mt-4">
                          <Button
                            size="sm"
                            onClick={() => {
                              handleAddIdea(idea);
                              setGeneratedIdeas(generatedIdeas.filter(i => i.id !== idea.id));
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add to Ideas
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className='bg-[#0f0f43] p-1'>
          <TabsTrigger className="data-[state=active]:bg-blue-600" value="all">All Ideas</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-blue-600" value="ai">AI Generated</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-blue-600" value="manual">Manual</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-blue-600" value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {ideas.length === 0 ? (
      <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas
            .filter(idea => {
              switch (activeTab) {
                case 'ai':
                  return idea.isAIGenerated && idea.status === 'active';
                case 'manual':
                  return !idea.isAIGenerated && idea.status === 'active';
                case 'rejected':
                  return idea.status === 'rejected';
                default:
                  return idea.status === 'active';
              }
            })
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map(renderIdeaCard)}
        </div>
      )}

      <Dialog open={!!editingIdea} onOpenChange={(open) => !open && setEditingIdea(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Idea</DialogTitle>
          </DialogHeader>
          {editingIdea && (
            <div className="space-y-4">
              <Input
                value={editingIdea.title}
                onChange={e => setEditingIdea({ ...editingIdea, title: e.target.value })}
                placeholder="Idea Title"
              />
              <Textarea
                value={editingIdea.description}
                onChange={e => setEditingIdea({ ...editingIdea, description: e.target.value })}
                placeholder="Idea Description"
                className="h-32"
              />
              <Select
                value={editingIdea.category}
                onValueChange={value => setEditingIdea({ ...editingIdea, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="process">Process</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button 
                  onClick={() => handleEditIdea(editingIdea)}
                  disabled={!editingIdea.title || !editingIdea.description}
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
                <Button variant="ghost" onClick={() => setEditingIdea(null)}>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IdeasPage;