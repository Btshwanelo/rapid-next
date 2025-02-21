'use client'
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Brain, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from '@/components/ui/EmptyState';

interface Persona {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  education: string;
  description: string;
  personalityTraits: string;
  goalsAndMotivations: string;
  challengesAndPainPoints: string;
  technologyUsage: string;
  preferredCommunication: string;
  brandsAndProducts: string;
  dayInLife: string;
  visualElements: string;
  quotes: string;
  avatarUrl: string;
  isAISuggested?: boolean;
}

const EMPTY_PERSONA: Omit<Persona, 'id'> = {
  name: '',
  age: 0,
  gender: '',
  occupation: '',
  education: '',
  description: '',
  personalityTraits: '',
  goalsAndMotivations: '',
  challengesAndPainPoints: '',
  technologyUsage: '',
  preferredCommunication: '',
  brandsAndProducts: '',
  dayInLife: '',
  visualElements: '',
  quotes: '',
  avatarUrl: '',
};

const PersonaForm = ({
  initialData,
  onSubmit,
  submitLabel,
}: {
  initialData: Omit<Persona, 'id'>;
  onSubmit: (data: Omit<Persona, 'id'>) => void;
  submitLabel: string;
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: keyof Omit<Persona, 'id'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-4">
        <div className="flex-1 space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Name"
            />
          </div>
          <div>
            <Label>Age</Label>
            <Input
              type="number"
              value={formData.age}
              onChange={e => handleChange('age', parseInt(e.target.value))}
              placeholder="Age"
            />
          </div>
          <div>
            <Label>Gender</Label>
            <Input
              value={formData.gender}
              onChange={e => handleChange('gender', e.target.value)}
              placeholder="Gender"
            />
          </div>
          <div>
            <Label>Occupation</Label>
            <Input
              value={formData.occupation}
              onChange={e => handleChange('occupation', e.target.value)}
              placeholder="Occupation"
            />
          </div>
          <div>
            <Label>Education</Label>
            <Input
              value={formData.education}
              onChange={e => handleChange('education', e.target.value)}
              placeholder="Education"
            />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Description"
              className="h-20"
            />
          </div>
          <div>
            <Label>Personality Traits</Label>
            <Textarea
              value={formData.personalityTraits}
              onChange={e => handleChange('personalityTraits', e.target.value)}
              placeholder="Personality Traits"
              className="h-20"
            />
          </div>
          <div>
            <Label>Goals and Motivations</Label>
            <Textarea
              value={formData.goalsAndMotivations}
              onChange={e => handleChange('goalsAndMotivations', e.target.value)}
              placeholder="Goals and Motivations"
              className="h-20"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-4">
          <div>
            <Label>Challenges and Pain Points</Label>
            <Textarea
              value={formData.challengesAndPainPoints}
              onChange={e => handleChange('challengesAndPainPoints', e.target.value)}
              placeholder="Challenges and Pain Points"
              className="h-20"
            />
          </div>
          <div>
            <Label>Technology Usage</Label>
            <Textarea
              value={formData.technologyUsage}
              onChange={e => handleChange('technologyUsage', e.target.value)}
              placeholder="Technology Usage"
              className="h-20"
            />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <Label>Preferred Communication</Label>
            <Textarea
              value={formData.preferredCommunication}
              onChange={e => handleChange('preferredCommunication', e.target.value)}
              placeholder="Preferred Communication"
              className="h-20"
            />
          </div>
          <div>
            <Label>Brands and Products</Label>
            <Textarea
              value={formData.brandsAndProducts}
              onChange={e => handleChange('brandsAndProducts', e.target.value)}
              placeholder="Brands and Products"
              className="h-20"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-4">
          <div>
            <Label>A Day in the Life</Label>
            <Textarea
              value={formData.dayInLife}
              onChange={e => handleChange('dayInLife', e.target.value)}
              placeholder="A Day in the Life"
              className="h-20"
            />
          </div>
          <div>
            <Label>Visual Elements</Label>
            <Textarea
              value={formData.visualElements}
              onChange={e => handleChange('visualElements', e.target.value)}
              placeholder="Visual Elements"
              className="h-20"
            />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <Label>Quotes</Label>
            <Textarea
              value={formData.quotes}
              onChange={e => handleChange('quotes', e.target.value)}
              placeholder="Quotes"
              className="h-20"
            />
          </div>
          <div>
            <Label>Avatar URL</Label>
            <Input
              value={formData.avatarUrl}
              onChange={e => handleChange('avatarUrl', e.target.value)}
              placeholder="Avatar URL"
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={() => onSubmit(formData)} 
        className="w-full mt-4"
        disabled={!formData.name}
      >
        {submitLabel}
      </Button>
    </div>
  );
};

const PersonaCard = ({ 
  persona, 
  onEdit, 
  onDelete, 
  onSelect,
  selected = false,
  showActions = true
}: { 
  persona: Persona;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  selected?: boolean;
  showActions?: boolean;
}) => (
  <Card className={`relative ${selected ? 'ring-2 ring-primary' : ''} bg-[#0f0f43] border-none text-white`}>
    <CardHeader className="p-4">
      <CardTitle className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={persona.avatarUrl} alt={persona.name} />
          <AvatarFallback>{persona.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{persona.name}</h3>
          <p className="text-sm text-gray-100">{persona.occupation}</p>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-100">Description</label>
          <p className="mt-1">{persona.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-100">Age</label>
            <p className="mt-1">{persona.age}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-100">Gender</label>
            <p className="mt-1">{persona.gender}</p>
          </div>
        </div>
      </div>
      {showActions && (
        <div className="flex justify-end gap-2 mt-4">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit2 className="w-4 h-4 mr-1" /> Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          )}
          {onSelect && (
            <Button variant="secondary" size="sm" onClick={onSelect}>
              <UserPlus className="w-4 h-4 mr-1" /> {selected ? 'Selected' : 'Select'}
            </Button>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);

const SystemPersonasPage = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [aiSuggestedPersonas, setAiSuggestedPersonas] = useState<Persona[]>([]);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddPersona = (personaData: Omit<Persona, 'id'>) => {
    const newPersona: Persona = {
      id: Date.now().toString(),
      ...personaData,
    };
    setPersonas([...personas, newPersona]);
    // Add this: Automatically select the new persona
    setSelectedPersonaIds(prev => new Set([...prev, newPersona.id]));
    setShowAddDialog(false);
  };

  const handleEditPersona = (personaData: Omit<Persona, 'id'>) => {
    if (!editingId) return;
    
    setPersonas(personas.map(persona =>
      persona.id === editingId
        ? { ...persona, ...personaData }
        : persona
    ));
    setEditingId(null);
  };

  const handleDeletePersona = (id: string) => {
    setPersonas(personas.filter(persona => persona.id !== id));
    setAiSuggestedPersonas(aiSuggestedPersonas.filter(persona => persona.id !== id));
    setSelectedPersonaIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const generateAIPersonas = async () => {
    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Example AI-generated personas
    const suggestedPersonas: Persona[] = [
      {
        id: 'ai-1',
        name: 'Sarah Chen',
        age: 32,
        gender: 'Female',
        occupation: 'UX Designer',
        education: 'Masters in HCI',
        description: 'Tech-savvy designer focused on accessibility',
        personalityTraits: 'Empathetic, detail-oriented, innovative',
        goalsAndMotivations: 'Creating inclusive digital experiences',
        challengesAndPainPoints: 'Balancing user needs with business requirements',
        technologyUsage: 'Heavy tech user, early adopter',
        preferredCommunication: 'Visual and direct communication',
        brandsAndProducts: 'Adobe, Figma, Apple',
        dayInLife: 'Starts with user research, ends with prototype testing',
        visualElements: 'Clean, minimal design aesthetic',
        quotes: '"Design is not just what it looks like, its how it works"',
        avatarUrl: '/api/placeholder/150/150',
        isAISuggested: true
      },
      // Add more AI-generated personas here
    ];
    
    setAiSuggestedPersonas(suggestedPersonas);
    setIsGenerating(false);
  };

  const togglePersonaSelection = (id: string) => {
    setSelectedPersonaIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">System Personas</h1>
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Persona
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Persona</DialogTitle>
              </DialogHeader>
              <PersonaForm
                initialData={EMPTY_PERSONA}
                onSubmit={handleAddPersona}
                submitLabel="Create Persona"
              />
            </DialogContent>
          </Dialog>

          <Button
            variant="secondary"
            onClick={generateAIPersonas}
            disabled={isGenerating}
          >
            <Brain className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate AI Personas'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="selected" className="space-y-4">
        <TabsList className='bg-[#0f0f43] p-1'>
          <TabsTrigger value="selected" className="data-[state=active]:bg-blue-600 ">Selected Personas</TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-blue-600">AI Suggested Personas</TabsTrigger>
        </TabsList>

        <TabsContent value="selected">
  {selectedPersonaIds.size === 0 ? (
    <EmptyState />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...personas, ...aiSuggestedPersonas]
        .filter(persona => selectedPersonaIds.has(persona.id))
        .map(persona => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            onEdit={() => setEditingId(persona.id)}
            onDelete={() => handleDeletePersona(persona.id)}
          />
        ))}
    </div>
  )}
</TabsContent>

        <TabsContent value="ai">
          {aiSuggestedPersonas.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiSuggestedPersonas.map(persona => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  selected={selectedPersonaIds.has(persona.id)}
                  onSelect={() => togglePersonaSelection(persona.id)}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Persona</DialogTitle>
          </DialogHeader>
          {editingId && personas.find(p => p.id === editingId) && (
            <PersonaForm
              initialData={personas.find(p => p.id === editingId) as Persona}
              onSubmit={handleEditPersona}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemPersonasPage;