'use client'
import React, { useEffect, useState } from 'react';
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
import { useCreateIdeaMutation, useDeleteIdeaMutation, useLazyGetIdeasByProjectQuery, useUpdateIdeaMutation } from '@/services/ideaService';
import useProject from '@/hooks/useProject';
import useAuth from '@/hooks/useAuth';

interface Idea {
  _id: string;
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
  const [selectedMethodology, setSelectedMethodology] = useState<string>('');
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [newIdeaData, setNewIdeaData] = useState({
    title: '',
    description: '',
  });

  const projectDeatils = useProject()
  const authDeatils = useAuth()

  const [CreateIdea,creatIdeaProps] = useCreateIdeaMutation()
  const [UpdateIdea,updateIdeaProps] = useUpdateIdeaMutation()
  const [DeleteIdea,deleteIdeaProps] = useDeleteIdeaMutation()
  const [GetIdeas,getIdeasProps] = useLazyGetIdeasByProjectQuery()


  const handleAddIdea = (idea: Partial<Idea>) => {
    CreateIdea({body:{
      "title":idea.title,
      "description":idea.description,
      "projectId":projectDeatils?._id
  },
  authToken:authDeatils.token})

    setShowAddDialog(false);
  };


  

  const handleEditIdea = (updatedIdea: Idea) => {
    
    UpdateIdea({id:updatedIdea?._id,authToken:authDeatils.token,body:{title:updatedIdea.title,description:updatedIdea.description}})
    setEditingIdea(null);
  };

  useEffect(() => {
    GetIdeas({id:projectDeatils?._id , authToken:authDeatils.token})
  }, [])
  

  const handleDeleteIdea = (id: string) => {
    DeleteIdea({id:id,authToken:authDeatils.token})
  };

  const handleRejectIdea = (id: string) => {
    setIdeas(ideas.map(idea =>
      idea._id === id ? { ...idea, status: 'rejected' } : idea
    ));
  };

  const handleKeepIdea = (id: string) => {
    setIdeas(ideas.map(idea =>
      idea._id === id ? { ...idea, status: 'active' } : idea
    ));
  };





  const renderIdeaCard = (idea: Idea) => (
    <Card key={idea._id} className={`w-full bg-[#0f0f43] text-white border-none ${idea?.status === 'rejected' ? 'opacity-60' : ''}`}>
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
          {/* {idea.methodology && (
            <Badge variant="outline" className='text-white'>{idea.methodology}</Badge>
          )} */}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className=" text-white">{idea.description}</p>
        {/* {idea.category && (
          <Badge variant="outline" className="mt-2 text-white">
            {idea.category}
          </Badge>
        )} */}
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
            onClick={() => handleDeleteIdea(idea._id)}
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
          <Link href={`/ideas/${idea._id}`}>
          <Button
            variant="ghost"
            size="sm"
            // onClick={() => handleDeleteIdea(idea._id)}
            >
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
            </Link>
        </div>
        {idea.isAIGenerated && (
          <div className="flex gap-2">
            {idea?.status === 'active' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRejectIdea(idea._id)}
              >
                <ThumbsDown className="w-4 h-4 mr-1" /> Reject
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleKeepIdea(idea._id)}
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

        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className='bg-[#0f0f43] p-1'>
          <TabsTrigger className="data-[state=active]:bg-blue-600" value="all">All Ideas</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-blue-600" value="manual">User Ideas</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-blue-600" value="ai">AI Generated</TabsTrigger>
        </TabsList>
      </Tabs>

      {getIdeasProps?.data?.data.length === 0 ? (
      <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getIdeasProps?.data?.data
            .filter((idea:any) => {
              switch (activeTab) {
                case 'ai':
                  return idea.isAiGenerated;
                case 'manual':
                  return !idea.isAIGenerated;
                case 'rejected':
                  return idea.status === 'rejected';
                default:
                  return idea.isAIGenerated !== null;
              }
            })
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