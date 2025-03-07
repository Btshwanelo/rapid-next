'use client'
import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, FileText, Circle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import EmptyState from '@/components/ui/EmptyState';
import { useCreateProblemMutation, useDeleteProblemMutation, useGetProblemByProjectQuery, useLazyGetProblemByProjectQuery, useUpdateProblemMutation } from '@/services/problemService';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import useAuth from '@/hooks/useAuth';
import useProject from '@/hooks/useProject';

interface ProblemStatement {
  id: string;
  userType: string;
  userDescription: string;
  improvement: string;
  struggles: string;
  comparison: string;
  idealState: string;
  worldBenefit: string;
  createdAt: Date;
}

interface FormData extends Omit<ProblemStatement, 'id' | 'createdAt'> {}

const EMPTY_FORM_DATA: FormData = {
  userType: '',
  userDescription: '',
  improvement: '',
  struggles: '',
  comparison: '',
  idealState: '',
  worldBenefit: '',
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
          value={formData.userDescription}
          onChange={e => handleChange('userDescription', e.target.value)}
          className="h-20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">We will improve his or her</label>
        <Textarea
          placeholder="What will be improved"
          value={formData.improvement}
          onChange={e => handleChange('improvement', e.target.value)}
          className="h-20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Currently this user struggles because</label>
        <Textarea
          placeholder="Current struggles"
          value={formData.struggles}
          onChange={e => handleChange('struggles', e.target.value)}
          className="h-20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Its kinda like</label>
        <Textarea
          placeholder="Analogous situation"
          value={formData.comparison}
          onChange={e => handleChange('comparison', e.target.value)}
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
          value={formData.worldBenefit}
          onChange={e => handleChange('worldBenefit', e.target.value)}
          className="h-20"
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={!formData.userType || !formData.userDescription}
      >
        {submitLabel}
      </Button>
    </div>
  );
};

const ProblemStatementsPage = () => {
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const authDetails = useAuth()
  const projectDetails = useProject()

  const [GetProblemByProject,problemProps] = useLazyGetProblemByProjectQuery()
  const [CreateProblem,creatProblemProps] =useCreateProblemMutation()
  const [DeleteProblem, deleteProblemProps] =useDeleteProblemMutation()
  const [UpdateProblem, updateProblemProps] =useUpdateProblemMutation()

  useEffect(() => {
    GetProblemByProject({ projectId: projectDetails?._id, authToken: authDetails?.token })
  }, [])
  

  const handleAddStatement = (formData: FormData) => {
    const statement: ProblemStatement = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
    };
    console.log("statement",statement)
    CreateProblem({body:{
      "userType": statement.userType,
      "user": statement.userDescription,
      "improve": statement.improvement,
      "currentStruggle": statement.struggles,
      "situation": statement.comparison,
      "idealState": statement.idealState,
      "benefit": statement.worldBenefit,
      "projectId":projectDetails?._id
    },authToken:authDetails.token})
    setShowAddDialog(false);
  };

  const handleEditStatement = (formData: FormData) => {
    if (!editingId) return;
    
    setProblemStatements(statements =>
      statements.map(statement =>
        statement.id === editingId
          ? { ...statement, ...formData }
          : statement
      )
    );
    setEditingId(null);
  };

  const handleDeleteStatement = (id: string) => {
    setProblemStatements(statements =>
      statements.filter(statement => statement.id !== id)
    );
  };

  const getEditingStatement = () => {
    if (!editingId) return null;
    return problemStatements.find(s => s.id === editingId);
  };

  const renderProblemStatement = (statement: ProblemStatement) => (
    <Card key={statement.id} className="w-full bg-[#0f0f43] text-white border-none">
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
      {/* Our user is section - Highlighted */}
      <div className="col-span-2  p-2 align-middle justify-center">
        <div className="flex  gap-3 align-middle items-center">
          <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
          <div className='flex items-center'>
            <h3 className="font-semibold text-white  mr-2 ">Our user is</h3>
            <p className="text-sm text-gray-600 bg-white p-2 rounded-xl">{statement.user}</p>
          </div>
        </div>
      </div>
      <div className="col-span-2  p-2 align-middle justify-center">
        <div className="flex  gap-3 align-middle items-center">
          <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
          <div className='flex items-center'>
            <h3 className="font-semibold text-white  mr-2 ">We will improve his or her
            </h3>
            <p className="text-sm text-gray-600 bg-white p-2 rounded-xl">{statement.improve}</p>
          </div>
        </div>
      </div>
      <div className="col-span-2  p-2 align-middle justify-center">
        <div className="flex  gap-3 align-middle items-center">
           <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
          <div className='flex items-center'>
            <h3 className="font-semibold text-white  mr-2 ">Currently this user struggles because
            </h3>
            <p className="text-sm text-gray-600 bg-white p-2 rounded-xl">{statement.currentStruggle}</p>
          </div>
        </div>
      </div>
      <div className="col-span-2  p-2 align-middle justify-center">
        <div className="flex  gap-3 align-middle items-center">
           <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
          <div className='flex items-center'>
            <h3 className="font-semibold text-white  mr-2 ">It's kinda like</h3>
            <p className="text-sm text-gray-600 bg-white p-2 rounded-xl">{statement.situation}</p>
          </div>
        </div>
      </div>
      <div className="col-span-2  p-2 align-middle justify-center">
        <div className="flex  gap-3 align-middle items-center">
           <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
          <div className='flex items-center'>
            <h3 className="font-semibold text-white  mr-2 ">In a perfect world, he or she would be able to            </h3>
            <p className="text-sm text-gray-600 bg-white p-2 rounded-xl">{statement.idealState}</p>
          </div>
        </div>
      </div>
     
      <div className="col-span-2  p-2 align-middle justify-center">
        <div className="flex  gap-3 align-middle items-center">
           <Circle className='text-primary w-3 h-3 rounded-full' strokeWidth={7} />
          <div className='flex items-center'>
            <h3 className="font-semibold text-white  mr-2 ">This would be great for the world because            </h3>
            <p className="text-sm text-gray-600 bg-white p-2 rounded-xl">{statement.benefit}</p>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
      <CardFooter className="p-4 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingId(statement.id)}
        >
          <Edit2 className="w-4 h-4 mr-1" /> Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteStatement(statement.id)}
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
            <Button className='font-medium '>
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

      {problemProps?.data?.data?.length === 0 ? (
       <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {problemProps?.data?.data?.map(renderProblemStatement)}
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