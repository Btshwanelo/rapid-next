'use client'
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Users, Image as ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from '@/components/ui/EmptyState';
import { useCreateStoryMutation, useDeleteStoryMutation, useLazyGetStoriesByProjectQuery, useUpdateStoryFrameMutation, useUpdateStoryMutation } from '@/services/storyboardService';

interface Frame {
  id: string;
  title: string;
  description: string;
  notes: string;
  imageUrl: string;
}

interface Storyboard {
  id: string;
  userType: string;
  description: string;
  frames: Frame[];
}

const EMPTY_FRAME: Frame = {
  id: '',
  title: '',
  description: '',
  notes: '',
  imageUrl: '',
};

const FRAME_COUNT = 6;

const StoryboardPage = () => {
  const [storyboards, setStoryboards] = useState<Storyboard[]>([]);
  const [selectedStoryboard, setSelectedStoryboard] = useState<string | null>(null);
  const [showAddStoryboardDialog, setShowAddStoryboardDialog] = useState(false);
  const [showFrameDialog, setShowFrameDialog] = useState(false);
  const [editingFrame, setEditingFrame] = useState<{ frame: Frame; index: number } | null>(null);
  const [newStoryboard, setNewStoryboard] = useState({
    userType: '',
    description: '',
  });

  //Queries
  const [CreateStory,createStoryProps] = useCreateStoryMutation()
  const [UpdateStoryFrame,storyFrameProps] = useUpdateStoryFrameMutation()
  const [UpdateStory,updateStoryProps] = useUpdateStoryMutation()
  const [GetStory,getStoryProps] = useLazyGetStoriesByProjectQuery()
  const [DeleteStory,deleteStoryProps] = useDeleteStoryMutation()

  const handleAddStoryboard = () => {
    if (newStoryboard.userType) {
      const emptyFrames: Frame[] = Array(FRAME_COUNT).fill(null).map(() => ({
        ...EMPTY_FRAME,
        id: Math.random().toString(36).substr(2, 9),
      }));

      const newStoryboardObj: Storyboard = {
        id: Date.now().toString(),
        userType: newStoryboard.userType,
        description: newStoryboard.description,
        frames: emptyFrames,
      };

      CreateStory({})
      setStoryboards([...storyboards, newStoryboardObj]);
      setSelectedStoryboard(newStoryboardObj.id);
      setNewStoryboard({ userType: '', description: '' });
      setShowAddStoryboardDialog(false);
    }
  };

  const handleEditFrame = (frameData: Frame, index: number) => {
    if (!selectedStoryboard) return;

    const updatedStoryboards = storyboards.map(storyboard => {
      if (storyboard.id === selectedStoryboard) {
        const updatedFrames = [...storyboard.frames];
        updatedFrames[index] = frameData;
        return { ...storyboard, frames: updatedFrames };
      }
      return storyboard;
    });

    setStoryboards(updatedStoryboards);
    setEditingFrame(null);
    setShowFrameDialog(false);
  };

  const handleDeleteStoryboard = (id: string) => {
    setStoryboards(storyboards.filter(s => s.id !== id));
    if (selectedStoryboard === id) {
      setSelectedStoryboard(null);
    }
  };

  const getCurrentStoryboard = () => {
    return storyboards.find(s => s.id === selectedStoryboard);
  };

  const renderFrameEditor = () => {
    if (!editingFrame) return null;

    const { frame, index } = editingFrame;

    return (
      <div className="space-y-4">
        <Input
          placeholder="Frame Title"
          value={frame.title}
          onChange={e => setEditingFrame({
            ...editingFrame,
            frame: { ...frame, title: e.target.value }
          })}
        />
        <Textarea
          placeholder="Frame Description"
          value={frame.description}
          onChange={e => setEditingFrame({
            ...editingFrame,
            frame: { ...frame, description: e.target.value }
          })}
          className="h-24"
        />
        <Textarea
          placeholder="Additional Notes"
          value={frame.notes}
          onChange={e => setEditingFrame({
            ...editingFrame,
            frame: { ...frame, notes: e.target.value }
          })}
          className="h-24"
        />
        <Input
          placeholder="Image URL"
          value={frame.imageUrl}
          onChange={e => setEditingFrame({
            ...editingFrame,
            frame: { ...frame, imageUrl: e.target.value }
          })}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={() => handleEditFrame(frame, index)}>
            <Save className="w-4 h-4 mr-2" /> Save Frame
          </Button>
          <Button variant="ghost" onClick={() => {
            setEditingFrame(null);
            setShowFrameDialog(false);
          }}>
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
        </div>
      </div>
    );
  };

  const renderFrame = (frame: Frame, index: number) => (
    <Card key={frame.id} className="w-full bg-[#0f0f43] border-none text-white">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Frame {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {frame.imageUrl ? (
          <div className="relative w-full h-48 mb-4 bg-gray-100 rounded">
            <img
              src={frame.imageUrl}
              alt={frame.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-48 mb-4 bg-gray-100 rounded">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <h3 className="font-semibold mb-2">{frame.title || 'Untitled Frame'}</h3>
        <p className="text-sm text-gray-600 mb-2">{frame.description}</p>
        {frame.notes && (
          <p className="text-sm text-gray-500 italic">Notes: {frame.notes}</p>
        )}
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => {
            setEditingFrame({ frame, index });
            setShowFrameDialog(true);
          }}
        >
          <Edit2 className="w-4 h-4 mr-2" /> Edit Frame
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Storyboards</h1>
        <Dialog open={showAddStoryboardDialog} onOpenChange={setShowAddStoryboardDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> New Storyboard
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Storyboard</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="User Type (e.g., New Customer, Admin)"
                value={newStoryboard.userType}
                onChange={e => setNewStoryboard({
                  ...newStoryboard,
                  userType: e.target.value
                })}
              />
              <Textarea
                placeholder="Storyboard Description"
                value={newStoryboard.description}
                onChange={e => setNewStoryboard({
                  ...newStoryboard,
                  description: e.target.value
                })}
              />
              <Button onClick={handleAddStoryboard} className="w-full">
                Create Storyboard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {storyboards.length === 0 ? (
        <EmptyState />
      ) : (
        <Tabs value={selectedStoryboard || ''} onValueChange={setSelectedStoryboard}>
          <TabsList className="mb-4 bg-[#0f0f43] p-1">
            {storyboards.map(storyboard => (
              <TabsTrigger key={storyboard.id} value={storyboard.id} className="flex items-center data-[state=active]:bg-blue-600">
                <Users className="w-4 h-4 mr-2" />
                {storyboard.userType}
              </TabsTrigger>
            ))}
          </TabsList>

          {storyboards.map(storyboard => (
            <TabsContent key={storyboard.id} value={storyboard.id}>
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">{storyboard.userType}</h2>
                    <p className="text-white">{storyboard.description}</p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteStoryboard(storyboard.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Storyboard
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {storyboard.frames.map((frame, index) => renderFrame(frame, index))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <Dialog open={showFrameDialog} onOpenChange={setShowFrameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Frame {editingFrame ? editingFrame.index + 1 : ''}
            </DialogTitle>
          </DialogHeader>
          {renderFrameEditor()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoryboardPage;