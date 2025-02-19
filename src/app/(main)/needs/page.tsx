'use client'
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, Brain, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from '@/components/ui/EmptyState';

interface NeedsStatement {
  id: string;
  personaId: string;
  statement: string;
  context: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  isAIGenerated?: boolean;
  status: 'active' | 'rejected';
  createdAt: Date;
}

interface Persona {
  id: string;
  name: string;
  avatarUrl: string;
  occupation: string;
}

const NeedsStatementForm = ({
  personas,
  initialData,
  onSubmit,
  submitLabel,
  selectedPersonaId,
}: {
  personas: Persona[];
  initialData: Partial<NeedsStatement>;
  onSubmit: (data: Partial<NeedsStatement>) => void;
  submitLabel: string;
  selectedPersonaId?: string;
}) => {
  const [formData, setFormData] = useState({
    personaId: selectedPersonaId || initialData.personaId || '',
    statement: initialData.statement || '',
    context: initialData.context || '',
    priority: initialData.priority || 'medium',
    category: initialData.category || '',
  });

  return (
    <div className="space-y-4">
      {!selectedPersonaId && (
        <div>
          <Select
            value={formData.personaId}
            onValueChange={(value) => setFormData({ ...formData, personaId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Persona" />
            </SelectTrigger>
            <SelectContent>
              {personas.map((persona) => (
                <SelectItem key={persona.id} value={persona.id}>
                  {persona.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Textarea
          placeholder="Need Statement"
          value={formData.statement}
          onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
          className="h-24"
        />
      </div>

      <div>
        <Textarea
          placeholder="Context"
          value={formData.context}
          onChange={(e) => setFormData({ ...formData, context: e.target.value })}
          className="h-20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value as 'high' | 'medium' | 'low' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
      </div>

      <Button
        onClick={() => onSubmit(formData)}
        className="w-full"
        disabled={!formData.statement || !formData.personaId}
      >
        {submitLabel}
      </Button>
    </div>
  );
};

const NeedsStatementCard = ({
  statement,
  persona,
  onEdit,
  onDelete,
  onKeep,
  onReject,
}: {
  statement: NeedsStatement;
  persona: Persona;
  onEdit?: () => void;
  onDelete?: () => void;
  onKeep?: () => void;
  onReject?: () => void;
}) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  return (
    <Card className={statement.status === 'rejected' ? 'opacity-60' : ''}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={persona?.avatarUrl} alt={persona.name} />
              <AvatarFallback>{persona.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{persona.name}</h3>
              <p className="text-sm text-gray-500">{persona.occupation}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={priorityColors[statement.priority]}>
              {statement.priority} priority
            </Badge>
            {statement.category && (
              <Badge variant="outline">{statement.category}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-lg font-medium mb-2">{statement.statement}</p>
        {statement.context && (
          <p className="text-gray-600 text-sm">{statement.context}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <div className="flex gap-2">
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
        </div>
        {statement.isAIGenerated && (
          <div className="flex gap-2">
            {onKeep && statement.status !== 'active' && (
              <Button variant="ghost" size="sm" onClick={onKeep}>
                <ThumbsUp className="w-4 h-4 mr-1" /> Keep
              </Button>
            )}
            {onReject && statement.status !== 'rejected' && (
              <Button variant="ghost" size="sm" onClick={onReject}>
                <ThumbsDown className="w-4 h-4 mr-1" /> Reject
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

const NeedsStatementsPage = () => {
  const [personas, setPersonas] = useState<Persona[]>([
    // Sample personas - replace with your actual personas data
    {
      id: '1',
      name: 'Sarah Chen',
      avatarUrl: '/api/placeholder/150/150',
      occupation: 'UX Designer'
    },
    // Add more personas
  ]);

  const [needsStatements, setNeedsStatements] = useState<NeedsStatement[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddStatement = (data: Partial<NeedsStatement>) => {
    const newStatement: NeedsStatement = {
      id: Date.now().toString(),
      personaId: data.personaId!,
      statement: data.statement!,
      context: data.context!,
      priority: data.priority!,
      category: data.category!,
      status: 'active',
      createdAt: new Date(),
    };
    setNeedsStatements([...needsStatements, newStatement]);
    setShowAddDialog(false);
  };

  const handleEditStatement = (data: Partial<NeedsStatement>) => {
    if (!editingId) return;
    setNeedsStatements(statements =>
      statements.map(statement =>
        statement.id === editingId
          ? { ...statement, ...data }
          : statement
      )
    );
    setEditingId(null);
  };

  const handleDeleteStatement = (id: string) => {
    setNeedsStatements(statements =>
      statements.filter(statement => statement.id !== id)
    );
  };

  const handleKeepStatement = (id: string) => {
    setNeedsStatements(statements =>
      statements.map(statement =>
        statement.id === id
          ? { ...statement, status: 'active' }
          : statement
      )
    );
  };

  const handleRejectStatement = (id: string) => {
    setNeedsStatements(statements =>
      statements.map(statement =>
        statement.id === id
          ? { ...statement, status: 'rejected' }
          : statement
      )
    );
  };

  const generateAINeedsStatements = async (personaId: string) => {
    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Example AI-generated needs statements
    const aiStatements: NeedsStatement[] = [
      {
        id: `ai-${Date.now()}-1`,
        personaId,
        statement: "Needs a streamlined way to track multiple design projects simultaneously",
        context: "Managing various project timelines and deliverables",
        priority: "high",
        category: "Productivity",
        isAIGenerated: true,
        status: 'active',
        createdAt: new Date()
      },
      // Add more AI-generated statements
    ];
    
    setNeedsStatements([...needsStatements, ...aiStatements]);
    setIsGenerating(false);
  };

  const filteredStatements = needsStatements
    .filter(statement => selectedPersonaId === 'all' || statement.personaId === selectedPersonaId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Needs Statements</h1>
        <div className="flex gap-2">
          <Select
            value={selectedPersonaId}
            onValueChange={setSelectedPersonaId}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Persona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Personas</SelectItem>
              {personas.map((persona) => (
                <SelectItem key={persona.id} value={persona.id}>
                  {persona.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Need
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Needs Statement</DialogTitle>
              </DialogHeader>
              <NeedsStatementForm
                personas={personas}
                initialData={{}}
                onSubmit={handleAddStatement}
                submitLabel="Add Statement"
                selectedPersonaId={selectedPersonaId}
              />
            </DialogContent>
          </Dialog>

          {selectedPersonaId && (
            <Button
              variant="secondary"
              onClick={() => generateAINeedsStatements(selectedPersonaId)}
              disabled={isGenerating}
            >
              <Brain className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate AI Needs'}
            </Button>
          )}
        </div>
      </div>

      {filteredStatements.length === 0 ? (
       
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStatements.map(statement => {
            const persona = personas.find(p => p.id === statement.personaId)!;
            return (
              <NeedsStatementCard
                key={statement.id}
                statement={statement}
                persona={persona}
                onEdit={() => setEditingId(statement.id)}
                onDelete={() => handleDeleteStatement(statement.id)}
                onKeep={() => handleKeepStatement(statement.id)}
                onReject={() => handleRejectStatement(statement.id)}
              />
            );
          })}
        </div>
      )}

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Needs Statement</DialogTitle>
          </DialogHeader>
          {editingId && needsStatements.find(s => s.id === editingId) && (
            <NeedsStatementForm
              personas={personas}
              initialData={needsStatements.find(s => s.id === editingId)!}
              onSubmit={handleEditStatement}
              submitLabel="Save Changes"
              selectedPersonaId={selectedPersonaId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NeedsStatementsPage;