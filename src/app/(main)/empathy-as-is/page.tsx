'use client'
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, Sparkles, Move, PlusCircle } from 'lucide-react';
import { useLazyGetEmpathyAsIsByPersonaQuery } from '@/services/empathyService';
import { useLazyGetPersonasListByProjectQuery } from '@/services/personaService';
import useProject from '@/hooks/useProject';
import useAuth from '@/hooks/useAuth';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEmpathyMapAsIsMutation } from '@/slices/autogenApiSlice';

type Persona = {
  id: string;
  name: string;
  description: string;
};

type EmpathyPoint = {
  id: string;
  content: string;
  position?: { x: number; y: number };
};

type EmpathySection = {
  thinks: EmpathyPoint[];
  does: EmpathyPoint[];
  says: EmpathyPoint[];
  feels: EmpathyPoint[];
};

type EmpathyData = {
  user: EmpathySection;
  ai: EmpathySection;
  combined: EmpathySection;
};

// Sortable Empathy Point Component
function SortableEmpathyPoint({ 
  point, 
  onEdit, 
  onDelete,
  isEditable
}: { 
  point: EmpathyPoint; 
  onEdit: () => void; 
  onDelete: () => void;
  isEditable: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: point.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="group relative bg-blue-950/40 p-3 rounded-lg border border-blue-900 shadow-sm hover:shadow-md transition-all w-fit max-w-44"
    >
      {isEditable && (
        <div className=" top-2 right-2  transition-opacity flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-400" onClick={onEdit}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-yellow-400 cursor-move" {...attributes} {...listeners}>
            <Move className="h-3 w-3" />
          </Button>
        </div>
      )}
      <p className="text-sm text-white pr-16">{point.content}</p>
    </div>
  );
}

const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

const createEmptySection = (): EmpathySection => ({
  thinks: [],
  does: [],
  says: [],
  feels: [],
});

const EmpathyMap = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'ai' | 'combined'>('user');
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [empathyData, setEmpathyData] = useState<EmpathyData>({
    user: createEmptySection(),
    ai: createEmptySection(),
    combined: createEmptySection(),
  });
  
  // Initialize sections if they don't exist
  const ensureDataStructure = (data: EmpathyData): EmpathyData => {
    const ensureSection = (section: EmpathySection): EmpathySection => {
      return {
        thinks: Array.isArray(section.thinks) ? section.thinks : [],
        does: Array.isArray(section.does) ? section.does : [],
        says: Array.isArray(section.says) ? section.says : [],
        feels: Array.isArray(section.feels) ? section.feels : [],
      };
    };
    
    return {
      user: ensureSection(data.user),
      ai: ensureSection(data.ai),
      combined: ensureSection(data.combined)
    };
  };

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof EmpathySection | null>(null);
  const [editingPoint, setEditingPoint] = useState<EmpathyPoint | null>(null);
  const [newEmpathyContent, setNewEmpathyContent] = useState("");

  const projectDetails = useProject();
  const authDetails = useAuth();

  const [GetPersonasListByProject, getPersonasProps] = useLazyGetPersonasListByProjectQuery();
  const [GetEmpathyAsIs, getEmpathyProps] = useLazyGetEmpathyAsIsByPersonaQuery();
  const [EmpathyMapAsIs, generateEmpathyProps] = useEmpathyMapAsIsMutation();

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    if(generateEmpathyProps.isSuccess){
      console.log('generateEmpathyProps.isSuccess',generateEmpathyProps.data)
    }
  }, [generateEmpathyProps.isSuccess])
  

  useEffect(() => {
    if (projectDetails?._id && authDetails?.token) {
      GetPersonasListByProject({id: projectDetails._id, authToken: authDetails.token});
    }
  }, [projectDetails, authDetails.token]);

  useEffect(() => {
    if (selectedPersona && authDetails?.token) {
      GetEmpathyAsIs({id: selectedPersona, authToken: authDetails.token});
    }
  }, [selectedPersona, authDetails.token]);

  useEffect(() => {
    if (getPersonasProps.data?.data && 
        Array.isArray(getPersonasProps.data.data) && 
        getPersonasProps.data.data.length > 0 && 
        !selectedPersona) {
      setSelectedPersona(getPersonasProps.data.data[0]._id);
    }
  }, [getPersonasProps.data]);

  useEffect(() => {
    if (getEmpathyProps.data) {
      // Safely handle the API response and ensure we have valid data structures
      const safeData = getEmpathyProps.data || createEmptySection();
      
      // Ensure all required fields exist
      const validatedData = {
        thinks: Array.isArray(safeData.thinks) ? safeData.thinks : [],
        does: Array.isArray(safeData.does) ? safeData.does : [],
        says: Array.isArray(safeData.says) ? safeData.says : [],
        feels: Array.isArray(safeData.feels) ? safeData.feels : []
      };
      
      setEmpathyData(prev => ({
        ...prev,
        user: validatedData,
        combined: validatedData
      }));
    }
  }, [getEmpathyProps.data]);

  const generateAIEmpathy = () => {
    // This would be replaced with an actual API call
    // For now, we'll just generate some dummy data

    EmpathyMapAsIs({message:"Our user is a coffee enthusiast. We will improve their overall coffee shop experience. Currently, this user struggles because finding a quiet place to work or relax in busy coffee shops is difficult. It's kinda like trying to focus while being surrounded by constant noise and distractions. In a perfect world, they would be able to enjoy a peaceful environment with good coffee and a comfortable seat, no matter the time of day. This would be great for the world because it would allow people to find balance and productivity in their daily routines while enjoying high-quality coffee in a welcoming atmosphere."})


    // const aiData = {
    //   thinks: [
    //     { id: generateUniqueId(), content: "AI-generated thought 1" },
    //     { id: generateUniqueId(), content: "AI-generated thought 2" }
    //   ],
    //   does: [
    //     { id: generateUniqueId(), content: "AI-generated action 1" },
    //     { id: generateUniqueId(), content: "AI-generated action 2" }
    //   ],
    //   says: [
    //     { id: generateUniqueId(), content: "AI-generated statement 1" },
    //     { id: generateUniqueId(), content: "AI-generated statement 2" }
    //   ],
    //   feels: [
    //     { id: generateUniqueId(), content: "AI-generated feeling 1" },
    //     { id: generateUniqueId(), content: "AI-generated feeling 2" }
    //   ]
    // };

    // setEmpathyData(prev => ({
    //   ...prev,
    //   ai: aiData,
    //   combined: {
    //     says: [...prev.user.says, ...aiData.says],
    //     does: [...prev.user.does, ...aiData.does],
    //     feels: [...prev.user.feels, ...aiData.feels],
    //     thinks: [...prev.user.thinks, ...aiData.thinks],
    //   }
    // }));
  };

  const handleOpenAddModal = (category: keyof EmpathySection) => {
    setActiveCategory(category);
    setNewEmpathyContent("");
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (category: keyof EmpathySection, point: EmpathyPoint) => {
    setActiveCategory(category);
    setEditingPoint(point);
    setNewEmpathyContent(point.content);
    setIsEditModalOpen(true);
  };

  const handleAddEmpathyPoint = () => {
    if (!activeCategory || !newEmpathyContent.trim()) return;

    const newPoint = {
      id: generateUniqueId(),
      content: newEmpathyContent.trim(),
    };

    setEmpathyData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [activeCategory]: [...prev[activeTab][activeCategory], newPoint]
      }
    }));

    setIsAddModalOpen(false);
    setNewEmpathyContent("");
  };

  const handleUpdateEmpathyPoint = () => {
    if (!activeCategory || !editingPoint || !newEmpathyContent.trim()) return;

    setEmpathyData(prev => {
      // Ensure we have a valid array for this category
      if (!Array.isArray(prev[activeTab][activeCategory])) {
        return prev;
      }
      
      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [activeCategory]: prev[activeTab][activeCategory].map(point =>
            point.id === editingPoint.id ? { ...point, content: newEmpathyContent.trim() } : point
          )
        }
      };
    });

    setIsEditModalOpen(false);
    setEditingPoint(null);
    setNewEmpathyContent("");
  };

  const handleDeleteEmpathyPoint = (category: keyof EmpathySection, id: string) => {
    setEmpathyData(prev => {
      // Ensure we have a valid array for this category
      if (!Array.isArray(prev[activeTab][category])) {
        return prev;
      }
      
      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [category]: prev[activeTab][category].filter(point => point.id !== id)
        }
      };
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.active || !result.over || result.active.id === result.over.id) return;
    
    // Extract the category from the item id (assuming format "category-id")
    const [category] = result.active.id.split('-');
    
    if (!category || !['thinks', 'does', 'says', 'feels'].includes(category)) return;
    
    setEmpathyData(prev => {
      // Ensure the section exists
      if (!prev[activeTab][category as keyof EmpathySection]) {
        return prev;
      }
      
      const activeIndex = prev[activeTab][category as keyof EmpathySection].findIndex(
        point => point.id === result.active.id
      );
      const overIndex = prev[activeTab][category as keyof EmpathySection].findIndex(
        point => point.id === result.over.id
      );
      
      if (activeIndex === -1 || overIndex === -1) return prev;
      
      const newItems = arrayMove(
        prev[activeTab][category as keyof EmpathySection],
        activeIndex,
        overIndex
      );
      
      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [category]: newItems
        }
      };
    });
  };

  const renderEmpathySection = (title: string, category: keyof EmpathySection) => (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
          setEmpathyData(prev => {
            // Ensure the category exists and is an array
            if (!Array.isArray(prev[activeTab][category])) {
              return prev;
            }
            
            // Find indices
            const oldIndex = prev[activeTab][category].findIndex(item => item.id === active.id);
            const newIndex = prev[activeTab][category].findIndex(item => item.id === over?.id);
            
            // Only proceed if both indices are valid
            if (oldIndex === -1 || newIndex === -1) {
              return prev;
            }
            
            return {
              ...prev,
              [activeTab]: {
                ...prev[activeTab],
                [category]: arrayMove(prev[activeTab][category], oldIndex, newIndex)
              }
            };
          });
        }
      }}
    >
      <Card className="h-64 bg-[#0f0f43] border-none flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg text-white">{title}</CardTitle>
          {activeTab !== 'combined' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenAddModal(category)}
              className="bg-blue-700 hover:bg-blue-800 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-2 overflow-y-auto flex-grow">
          <SortableContext 
            items={empathyData[activeTab][category]?.map(item => item.id) || []} 
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-2">
              {empathyData[activeTab][category]?.map((point) => (
                <SortableEmpathyPoint
                  key={point.id}
                  point={point}
                  onEdit={() => handleOpenEditModal(category, point)}
                  onDelete={() => handleDeleteEmpathyPoint(category, point.id)}
                  isEditable={activeTab !== 'combined'}
                />
              ))}
            </div>
          </SortableContext>
          
          {(!empathyData[activeTab][category] || empathyData[activeTab][category].length === 0) && (
            <div className="flex flex-col items-center justify-center h-28 text-gray-400">
              <p>No entries yet</p>
              {activeTab !== 'combined' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="mt-2 text-blue-400" 
                  onClick={() => handleOpenAddModal(category)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add your first entry
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </DndContext>
  );

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Empathy Map As Is</h1>
        <div className="flex items-center gap-4">
          <Select 
            value={selectedPersona} 
            onValueChange={setSelectedPersona}
          >
            <SelectTrigger className="max-w-[250px]">
              <SelectValue placeholder="Select persona" />
            </SelectTrigger>
            <SelectContent>
              {getPersonasProps?.data?.data && Array.isArray(getPersonasProps?.data?.data) ? 
                getPersonasProps.data.data.map((persona: any) => (
                <SelectItem 
                  key={persona._id} 
                  value={persona._id}
                >
                  <span className="font-medium">{persona.name}</span>
                </SelectItem>
              ))
              : <SelectItem value="no-personas">No personas available</SelectItem>
              }
            </SelectContent>
          </Select>

          {activeTab === 'ai' && (
            <Button
              variant="default"
              onClick={generateAIEmpathy}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Insights
            </Button>
          )}
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value: string) => setActiveTab(value as 'user' | 'ai' | 'combined')} 
        className="w-full"
      >
        <TabsList className="bg-[#0f0f43] p-1 mb-6">
          <TabsTrigger value="user" className="data-[state=active]:bg-blue-600">User Generated</TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-blue-600">AI Generated</TabsTrigger>
          <TabsTrigger value="combined" className="data-[state=active]:bg-blue-600">Combined View</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-2 gap-6">
          {renderEmpathySection('Says', 'says')}
          {renderEmpathySection('Does', 'does')}
          {renderEmpathySection('Feels', 'feels')}
          {renderEmpathySection('Thinks', 'thinks')}
        </div>
      </Tabs>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Entry</DialogTitle>
            <DialogDescription>
              Add a new entry to the {activeCategory} section.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="empathy-content">Content</Label>
              <Textarea
                id="empathy-content"
                value={newEmpathyContent}
                onChange={(e) => setNewEmpathyContent(e.target.value)}
                placeholder="Enter your insight..."
                className="h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEmpathyPoint}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
            <DialogDescription>
              Update this entry in the {activeCategory} section.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-empathy-content">Content</Label>
              <Textarea
                id="edit-empathy-content"
                value={newEmpathyContent}
                onChange={(e) => setNewEmpathyContent(e.target.value)}
                placeholder="Enter your insight..."
                className="h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateEmpathyPoint}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmpathyMap;