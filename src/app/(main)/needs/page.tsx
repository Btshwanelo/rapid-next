'use client'
import React, { useEffect, useState } from 'react';
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
import { useCreateNeedMutation, useCreateNeedsMutation, useDeleteNeedMutation, useLazyGetNeedsByProjectQuery, useLazyGetNeedsByUserQuery, useUpdateNeedMutation } from '@/services/needService';
import { useLazyGetPersonasListByProjectQuery } from '@/services/personaService';
import useAuth from '@/hooks/useAuth';
import { useGenerateNeedsMutation } from '@/slices/autogenApiSlice';
import { extractForNeedsData } from '@/utils';
import useProject from '@/hooks/useProject';


interface NeedsStatement {
  id: string;
  personaId: string;
  need: string;
  reason: string;
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
    statement: initialData.need || '',
    context: initialData.reason || '',
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
  onEdit,
  onDelete,
  onKeep,
  onReject,
}: {
  statement: NeedsStatement;
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
    <Card className={'bg-[#0f0f43] text-white border-none'}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          {/* <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={persona?.avatarUrl} alt={persona.name} />
              <AvatarFallback>{persona.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{persona.name}</h3>
              <p className="text-sm ">{persona.occupation}</p>
            </div>
          </div> */}
          <div className="flex gap-2">
            <Badge className={priorityColors[statement.priority]}>
              {statement.priority} priority
            </Badge>
            {statement.category && (
              <Badge variant="outline" className='text-white'>{statement.category}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-lg font-medium mb-2">{statement.need}</p>
        
          <p className=" text-sm">{statement.reason}</p>
        
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
    const [activeTab, setActiveTab] = useState('all');
  const projectDeatils = useProject()
  const authDeatils = useAuth()

  const [GetPersonasListByProject,getPersonasProps] =useLazyGetPersonasListByProjectQuery()
  const [CreateNeed,createProps] = useCreateNeedMutation()
  const [CreateNeeds,createNeedsProps] = useCreateNeedsMutation()
  const [GetNeedsByUser,getProps]= useLazyGetNeedsByUserQuery()
  const [UpdateNeed,updateProps] = useUpdateNeedMutation()
  const [DeleteNeed,deleteProps] = useDeleteNeedMutation()
  const [GenerateNeeds,generateNeedsProps] = useGenerateNeedsMutation()

      useEffect(() => {
        GetPersonasListByProject({id:projectDeatils?._id,authToken:authDeatils.token})
      }, [])

  const handleAddStatement = (data: Partial<NeedsStatement>) => {
    CreateNeed({
      body:{
        userId:selectedPersonaId,
        need: data.need,
        reason: data.reason,
        projectId:projectDeatils?._id
      }
      ,authToken:authDeatils.token})

    setShowAddDialog(false);
  };

  const handleEditStatement = (data: Partial<NeedsStatement>) => {
    if (!editingId) return;

    UpdateNeed({
      body:{
        userId:selectedPersonaId,
        need: data.need,
        reason: data.reason,
        projectId:projectDeatils?._id
      }
      ,authToken:authDeatils.token
      ,id:editingId
    })
    setNeedsStatements(statements =>
      statements.map(statement =>
        statement.id === editingId
          ? { ...statement, ...data }
          : statement
      )
    );
    setEditingId(null);
  };

  useEffect(() => {
    if(selectedPersonaId !=='all'){
      GetNeedsByUser({id:selectedPersonaId,authToken:authDeatils.token})
    }
  }, [selectedPersonaId])
  

  const handleDeleteStatement = (id: string) => {
    DeleteNeed({id,authToken:authDeatils.token})
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

    GenerateNeeds({message:"Our user is a coffee enthusiast. We will improve their overall coffee shop experience. Currently, this user struggles because finding a quiet place to work or relax in busy coffee shops is difficult. It's kinda like trying to focus while being surrounded by constant noise and distractions. In a perfect world, they would be able to enjoy a peaceful environment with good coffee and a comfortable seat, no matter the time of day. This would be great for the world because it would allow people to find balance and productivity in their daily routines while enjoying high-quality coffee in a welcoming atmosphere."})
    
    setIsGenerating(false);
  };

  useEffect(() => {
    if(generateNeedsProps.isSuccess){
      const needs = extractForNeedsData(generateNeedsProps.data,projectDeatils?._id,selectedPersonaId);
      CreateNeeds({body:needs,authToken:authDeatils.token})
    }
  }, [generateNeedsProps.isSuccess])
  

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
              {getPersonasProps?.data?.data.map((persona:any) => (
                              <SelectItem 
                                key={persona._id} 
                                value={persona._id}
                                className=""
                              >
                                <span className="font-medium">{persona.name}</span>
                                {/* <span className="text-sm text-muted-foreground">{persona.description}</span> */}
                              </SelectItem>
                            ))}
            </SelectContent>
          </Select>

         {activeTab ==='manual'&& <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
          </Dialog>}

          {activeTab ==='ai' && (
            <Button
              variant="default"
              onClick={() => generateAINeedsStatements(selectedPersonaId)}
              disabled={isGenerating}
            >
              <Brain className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate AI Needs'}
            </Button>
          )}
        </div>
      </div>
       <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className='bg-[#0f0f43] p-1'>
                <TabsTrigger className="data-[state=active]:bg-blue-600" value="manual">User Needs</TabsTrigger>
                <TabsTrigger className="data-[state=active]:bg-blue-600" value="ai">AI Generated</TabsTrigger>
                <TabsTrigger className="data-[state=active]:bg-blue-600" value="all">All Needs</TabsTrigger>
              </TabsList>
            </Tabs>

      {getProps?.data?.data?.length === 0 ? (
       
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getProps?.data?.data
            .filter((need:any) => {
              switch (activeTab) {
                case 'ai':
                  return need.isAiGenerated;
                case 'manual':
                  return !need.isAIGenerated;
                default:
                  return need.isAIGenerated !== null;
              }
            }).map((need:any)=>(
              <NeedsStatementCard
              key={need._id}
              statement={need}
              onEdit={() => setEditingId(need._id)}
              onDelete={() => handleDeleteStatement(need._id)}
              onKeep={() => handleKeepStatement(need._id)}
              onReject={() => handleRejectStatement(need._id)}
              />
            )
          )}
        </div>
      )}


      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Needs Statement</DialogTitle>
          </DialogHeader>
          {editingId && getProps?.data?.data.find((s:any) => s._id === editingId) && (
            <NeedsStatementForm
              personas={personas}
              initialData={getProps?.data?.data.find((s:any) => s._id === editingId)!}
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