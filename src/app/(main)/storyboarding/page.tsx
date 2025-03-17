'use client'
import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Users, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Toast, useToast } from "@/components/ui/toast"; // Assuming you're using the toast component from shadcn
import EmptyState from '@/components/ui/EmptyState';
import { useCreateStoryMutation, useDeleteStoryMutation, useLazyGetStoriesByProjectQuery, useUpdateStoryFrameMutation, useUpdateStoryMutation } from '@/services/storyboardService';
import useProject from '@/hooks/useProject';
import useAuth from '@/hooks/useAuth';
import { useCreateImageMutation, useStoryboardScenesMutation } from '@/slices/autogenApiSlice';
import { extractStoryboardData } from '@/utils';

interface Frame {
  id: string;
  _id?: string;
  title: string;
  description: string;
  notes: string;
  imageUrl: string;
}

interface Storyboard {
  id: string;
  _id: string;
  userType?: string;
  title: string;
  description: string;
  frames: Frame[];
}

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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingScenes, setIsGeneratingScenes] = useState(false);
  
  // const { toast } = useToast();
  const authDetails = useAuth();
  const projectDetails = useProject();

  const [createStory, createStoryProps] = useCreateStoryMutation();
  const [updateStoryFrame, storyFrameProps] = useUpdateStoryFrameMutation();
  const [updateStory, updateStoryProps] = useUpdateStoryMutation();
  const [getStory, getStoryProps] = useLazyGetStoriesByProjectQuery();
  const [deleteStory, deleteStoryProps] = useDeleteStoryMutation();
  const [createImage, imageProps] = useCreateImageMutation();
  const [storyboardScenes, storyScenesProps] = useStoryboardScenesMutation();

  // Load storyboards when project changes
  useEffect(() => {
    if (projectDetails?._id) {
      loadStoryboards();
    }
  }, [projectDetails]);

  const loadStoryboards = async () => {
    try {
      await getStory({ projectId: projectDetails?._id, authToken: authDetails.token });
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to load storyboards",
      //   variant: "destructive"
      // });
      console.log('err')
    }
  };

  // Update storyboards when data is fetched
  useEffect(() => {
    if (getStoryProps.isSuccess && getStoryProps.data?.data) {
      setStoryboards(getStoryProps.data.data);
      
      // Set first storyboard as selected if none is selected
      if (!selectedStoryboard && getStoryProps.data.data.length > 0) {
        setSelectedStoryboard(getStoryProps.data.data[0]._id);
      }
    }
  }, [getStoryProps.isSuccess, getStoryProps.data]);

  // Handle storyboard creation
  const handleAddStoryboard = async () => {
    if (!newStoryboard.userType) return;

    try {
      setIsGeneratingScenes(true);
      await createStory({
        body: {
          projectId: projectDetails?._id,
          title: newStoryboard.userType,
          description: newStoryboard.description
        },
        authToken: authDetails.token
      });
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to create storyboard",
      //   variant: "destructive"
      // });
      setIsGeneratingScenes(false);
    }
  };

  // Handle successful storyboard creation
  useEffect(() => {
    if (createStoryProps.isSuccess && createStoryProps.data?.data) {
      // Generate scenes after creating storyboard
      storyboardScenes({ message: "give me story for coffee shop app" });
      
      // Show success message
      // toast({
      //   title: "Success",
      //   description: "Storyboard created successfully",
      // });
      
      // Update UI
      setNewStoryboard({ userType: '', description: '' });
      setShowAddStoryboardDialog(false);
    }
  }, [createStoryProps.isSuccess]);

  // Handle scene generation
  useEffect(() => {
    if (storyScenesProps.isSuccess && createStoryProps.data?.data?._id) {
      const scenes = extractStoryboardData(storyScenesProps.data);
      
      updateStory({
        body: { frames: scenes },
        id: createStoryProps.data.data._id,
        authToken: authDetails.token
      });
    }
  }, [storyScenesProps.isSuccess]);

  // Handle story update completion
  useEffect(() => {
    if (updateStoryProps.isSuccess) {
      setIsGeneratingScenes(false);
      
      // Refresh storyboards after update
      loadStoryboards();
      
      // Set the newly created storyboard as selected
      if (createStoryProps.data?.data?._id) {
        setSelectedStoryboard(createStoryProps.data.data._id);
      }
      
      // toast({
      //   title: "Success",
      //   description: "Storyboard scenes generated successfully",
      // });
    }
  }, [updateStoryProps.isSuccess]);

  // Handle image generation
  const handleCreateImage = async () => {
    if (!editingFrame) return;
    
    setIsGeneratingImage(true);
    try {
      await createImage({
        message: "sarah is a 24 year old economics student who loves all things finance, most of all, she loves her coffee",
        imagetype: "persona"
      });
    } catch (error) {
      setIsGeneratingImage(false);
      // toast({
      //   title: "Error",
      //   description: "Failed to generate image",
      //   variant: "destructive"
      // });
    }
  };

  // Handle successful image generation
  useEffect(() => {
    if (imageProps.isSuccess && selectedStoryboard && editingFrame) {
      updateStoryFrame({
        body: { imageUrl: imageProps?.data?.image_url || '' },
        storyId: selectedStoryboard,
        frameIndx: editingFrame.index,
        authToken: authDetails.token
      });
      
      // toast({
      //   title: "Success",
      //   description: "Image generated successfully",
      // });
    }
  }, [imageProps.isSuccess]);

  // Handle frame update completion
  useEffect(() => {
    if (storyFrameProps.isSuccess) {
      setIsGeneratingImage(false);
      loadStoryboards();
      
      // Close frame editor if open
      if (showFrameDialog) {
        setEditingFrame(null);
        setShowFrameDialog(false);
      }
    }
  }, [storyFrameProps.isSuccess]);

  // Handle frame edit submission
  const handleEditFrame = async (frameData: Frame, index: number) => {
    if (!selectedStoryboard) return;
    
    try {
      await updateStoryFrame({
        body: {
          description: frameData.description,
          notes: frameData.notes,
          imageUrl: frameData.imageUrl,
          title: frameData.title
        },
        storyId: selectedStoryboard,
        frameIndx: index,
        authToken: authDetails.token
      });
      
      // toast({
      //   title: "Success",
      //   description: "Frame updated successfully",
      // });
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to update frame",
      //   variant: "destructive"
      // });
    }
  };

  // Handle storyboard deletion
  const handleDeleteStoryboard = async (id: string) => {
    try {
      await deleteStory({ id, authToken: authDetails.token });
      
      // Update local state immediately
      setStoryboards(prevStoryboards => prevStoryboards.filter(sb => sb._id !== id));
      
      if (selectedStoryboard === id) {
        const remainingStoryboards = storyboards.filter(sb => sb._id !== id);
        setSelectedStoryboard(remainingStoryboards.length > 0 ? remainingStoryboards[0]._id : null);
      }
      
      // toast({
      //   title: "Success",
      //   description: "Storyboard deleted successfully",
      // });
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to delete storyboard",
      //   variant: "destructive"
      // });
    }
  };

  // Handle deletion completion
  useEffect(() => {
    if (deleteStoryProps.isSuccess) {
      loadStoryboards();
    }
  }, [deleteStoryProps.isSuccess]);

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
          <Button 
            onClick={() => handleEditFrame(frame, index)} 
            disabled={storyFrameProps.isLoading}
          >
            {storyFrameProps.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Frame
              </>
            )}
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
    <Card key={frame._id || index} className="w-full bg-[#0f0f43] border-none text-white">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Frame {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {frame?.imageUrl ? (
          <div className="relative w-full h-48 mb-4 bg-gray-100 rounded">
            <img
              src={frame.imageUrl}
              alt={frame.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-48 mb-4 bg-gray-100 rounded">
            <Button 
              variant={'default'} 
              disabled={isGeneratingImage}
              onClick={() => {
                setEditingFrame({ frame, index });
                handleCreateImage();
              }}
            >
              {isGeneratingImage && editingFrame?.index === index ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                </>
              ) : (
                <>Generate Frame</>
              )}
            </Button>
          </div>
        )}
        <h3 className="font-semibold mb-2">{frame.title || 'Untitled Frame'}</h3>
        
        <p className="text-sm text-gray-300 mb-2">{frame.description}</p>
        {frame.notes && (
          <p className="text-sm text-gray-400 italic">Notes: {frame.notes}</p>
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
              <Button 
                onClick={handleAddStoryboard} 
                className="w-full"
                disabled={isGeneratingScenes || createStoryProps.isLoading}
              >
                {isGeneratingScenes || createStoryProps.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                  </>
                ) : (
                  <>Create Storyboard</>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading state */}
      {getStoryProps.isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-white">Loading storyboards...</span>
        </div>
      )}

      {/* Empty state */}
      {!getStoryProps.isLoading && storyboards.length === 0 ? (
        <EmptyState />
      ) : (
        <Tabs 
          value={selectedStoryboard || ''} 
          onValueChange={setSelectedStoryboard}
          className={getStoryProps.isLoading ? 'opacity-50 pointer-events-none' : ''}
        >
          <TabsList className="mb-4 bg-[#0f0f43] p-1">
            {storyboards.map(storyboard => (
              <TabsTrigger key={storyboard._id} value={storyboard._id} className="flex items-center data-[state=active]:bg-blue-600">
                <Users className="w-4 h-4 mr-2" />
                {storyboard.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {storyboards.map(storyboard => (
            <TabsContent key={storyboard._id} value={storyboard._id}>
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">{storyboard.title}</h2>
                    <p className="text-white">{storyboard.description}</p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteStoryboard(storyboard._id)}
                    disabled={deleteStoryProps.isLoading}
                  >
                    {deleteStoryProps.isLoading && deleteStoryProps.originalArgs?.id === storyboard._id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Storyboard
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {storyboard.frames && storyboard.frames.length > 0 ? (
                  storyboard.frames.map((frame, index) => renderFrame(frame, index))
                ) : (
                  <div className="col-span-3 flex justify-center items-center h-64">
                    <p className="text-gray-400">No frames available yet</p>
                  </div>
                )}
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