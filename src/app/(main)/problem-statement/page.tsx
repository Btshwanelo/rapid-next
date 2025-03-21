'use client'
import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Circle, User2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import EmptyState from '@/components/ui/EmptyState';
import { 
  useCreateProblemMutation, 
  useDeleteProblemMutation, 
  useLazyGetProblemByProjectQuery, 
  useUpdateProblemMutation 
} from '@/services/problemService';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import useAuth from '@/hooks/useAuth';
import useProject from '@/hooks/useProject';
import Link from 'next/link';

interface ProblemStatement {
  _id: string;
  userType: string;
  user: string;
  improve: string;
  currentStruggle: string;
  situation: string;
  idealState: string;
  benefit: string;
  createdAt: Date;
}

interface FormData extends Omit<ProblemStatement, '_id' | 'createdAt'> {}

const EMPTY_FORM_DATA: FormData = {
  userType: '',
  user: '',
  improve: '',
  currentStruggle: '',
  situation: '',
  idealState: '',
  benefit: '',
};

const StatementForm = ({ 
  initialData,
  onSubmit,
  submitLabel 
}: { 
  initialData: FormData,
  onSubmit: (data: FormData) => void,
  submitLabel: string
}) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  
  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">User Type</label>
        <Input
          placeholder="e.g., Customer, Admin, etc."
          value={formData.userType}
          onChange={e => handleChange('userType', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Our user is</label>
        <Textarea
          placeholder="Describe the user"
          value={formData.user}
          onChange={e => handleChange('user', e.target.value)}
          className="h-20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">We will improve his or her</label>
        <Textarea
          placeholder="What will be improved"
          value={formData.improve}
          onChange={e => handleChange('improve', e.target.value)}
          className="h-20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Currently this user struggles because</label>
        <Textarea
          placeholder="Current struggle"
          value={formData.currentStruggle}
          onChange={e => handleChange('currentStruggle', e.target.value)}
          className="h-20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Its kinda like</label>
        <Textarea
          placeholder="Analogous situation"
          value={formData.situation}
          onChange={e => handleChange('situation', e.target.value)}
          className="h-20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">In a perfect world, he or she would be able to</label>
        <Textarea
          placeholder="Ideal state"
          value={formData.idealState}
          onChange={e => handleChange('idealState', e.target.value)}
          className="h-20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">This would be great for the world because</label>
        <Textarea
          placeholder="World benefit"
          value={formData.benefit}
          onChange={e => handleChange('benefit', e.target.value)}
          className="h-20"
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={!formData.userType || !formData.user}
      >
        {submitLabel}
      </Button>
    </div>
  );
};

const ProblemStatementsPage = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const authDetails = useAuth();
  const projectDetails = useProject();
  
  // API hooks
  const [getProblemByProject, problemProps] = useLazyGetProblemByProjectQuery();
  const [createProblem, createProblemProps] = useCreateProblemMutation();
  const [deleteProblem, deleteProblemProps] = useDeleteProblemMutation();
  const [updateProblem, updateProblemProps] = useUpdateProblemMutation();

  // Fetch problems on component mount
  useEffect(() => {
    if (projectDetails?._id && authDetails?.token) {
      getProblemByProject({ 
        projectId: projectDetails._id, 
        authToken: authDetails.token 
      });
    }
  }, [projectDetails, authDetails, getProblemByProject]);

  const handleAddStatement = (formData: FormData) => {
    if (!projectDetails?._id || !authDetails?.token) return;
    
    createProblem({
      body: {
        ...formData,
        projectId: projectDetails._id
      },
      authToken: authDetails.token
    });
    
    setShowAddDialog(false);
  };

  const handleEditStatement = (formData: FormData) => {
    if (!editingId || !projectDetails?._id || !authDetails?.token) return;
    
    updateProblem({
      body: {
        ...formData,
        projectId: projectDetails._id
      },
      authToken: authDetails.token,
      id: editingId
    });
    
    setEditingId(null);
  };

  const handleDeleteStatement = (id: string) => {
    if (!authDetails?.token) return;
    
    deleteProblem({
      authToken: authDetails.token,
      id
    });
  };

  const getEditingStatement = (): FormData | null => {
    if (!editingId || !problemProps?.data?.data) return null;
    
    const statement = problemProps.data.data.find((s:any) => s._id === editingId);
    
    if (!statement) return null;
    
    return {
      userType: statement.userType,
      user: statement.user,
      improve: statement.improve,
      currentStruggle: statement.currentStruggle,
      situation: statement.situation,
      idealState: statement.idealState,
      benefit: statement.benefit,
    };
  };

  const renderProblemStatement = (statement: ProblemStatement) => (
    <Card key={statement._id} className="w-full bg-[#0f0f43] text-white border-none">
      <CardHeader className="p-4">
        <CardTitle className="text-lg text-white flex items-center justify-between">
          <span className="flex items-center gap-2 text-white">
            <FileText className="w-4 h-4" />
            {statement.userType}
          </span>
          <Badge variant="outline" className='text-white'>
            {new Date(statement.createdAt).toLocaleDateString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-2">
          {/* Our user is section */}
          <div className="col-span-2 p-2 align-middle justify-center">
            <div className="flex gap-3 align-middle items-center">
              <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
              <div className='flex items-center'>
                <h3 className="font-semibold text-white mr-2">Our user is</h3>
                <p className="text-gray-300 bg-blue-500/10 p-2 rounded-lg">{statement.user}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 p-2 align-middle justify-center">
            <div className="flex gap-3 align-middle items-center">
              <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
              <div className='flex items-center'>
                <h3 className="font-semibold text-white mr-2">We will improve his or her</h3>
                <p className="text-gray-300 bg-blue-500/10 p-2 rounded-lg">{statement.improve}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 p-2 align-middle justify-center">
            <div className="flex gap-3 align-middle items-center">
              <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
              <div className='flex items-center'>
                <h3 className="font-semibold text-white mr-2">Currently this user struggles because</h3>
                <p className="text-gray-300 bg-blue-500/10 p-2 rounded-lg">{statement.currentStruggle}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 p-2 align-middle justify-center">
            <div className="flex gap-3 align-middle items-center">
              <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
              <div className='flex items-center'>
                <h3 className="font-semibold text-white mr-2">It's kinda like</h3>
                <p className=" text-gray-300 bg-blue-500/10 p-2 rounded-lg">{statement.situation}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 p-2 align-middle justify-center">
            <div className="flex gap-3 align-middle items-center">
              <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
              <div className='flex items-center'>
                <h3 className="font-semibold text-white mr-2">In a perfect world, he or she would be able to</h3>
                <p className="text-gray-300 bg-blue-500/10 p-2 rounded-lg">{statement.idealState}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 p-2 align-middle justify-center">
            <div className="flex gap-3 align-middle items-center">
              <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
              <div className='flex items-center'>
                <h3 className="font-semibold text-white mr-2">This would be great for the world because</h3>
                <p className="text-gray-300 bg-blue-500/10 p-2 rounded-lg">{statement.benefit}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-end gap-2">
        <Link href={`/problem-statement/${statement._id}/clarifying-questions`}>
        <Button
          variant="ghost"
          size="sm"
        >
          <User2 className="w-4 h-4 mr-1" /> Clarifying questions
        </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingId(statement._id)}
        >
          <Edit2 className="w-4 h-4 mr-1" /> Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteStatement(statement._id)}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Problem Statements</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className='font-medium'>
              <Plus className="w-4 h-4 mr-2" /> New Problem Statement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Problem Statement</DialogTitle>
            </DialogHeader>
            <StatementForm
              initialData={EMPTY_FORM_DATA}
              onSubmit={handleAddStatement}
              submitLabel="Create Problem Statement"
            />
          </DialogContent>
        </Dialog>
      </div>

      {!problemProps?.data?.data || problemProps.data.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {problemProps.data.data.map(renderProblemStatement)}
        </div>
      )}

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Problem Statement</DialogTitle>
          </DialogHeader>
          {editingId && getEditingStatement() && (
            <StatementForm
              initialData={getEditingStatement() as FormData}
              onSubmit={handleEditStatement}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProblemStatementsPage;