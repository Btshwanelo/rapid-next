'use client'
import React, { useEffect, useState } from 'react';
import { Plus, GripHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EmptyState from '@/components/ui/EmptyState';
import useProject from '@/hooks/useProject';
import useAuth from '@/hooks/useAuth';
import { useLazyGetIdeasByProjectQuery, useUpdateIdeaMutation, useUpdateIdeaPositionMutation } from '@/services/ideaService';
import { useIdeaPrioritizeMutation } from '@/slices/autogenApiSlice';

interface Feature {
  id: string;
  title: string;
  description: string;
  quadrant: 'q1' | 'q2' | 'q3' | 'q4'|'none';
  position: { x: number; y: number };
}

const PriorizationGrid = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [draggedFeature, setDraggedFeature] = useState<Feature | null>(null);
  const projectDeatils = useProject()
  const authDeatils = useAuth()

    const [UpdateIdeaPosition,updateIdeaProps] = useUpdateIdeaPositionMutation()
    const [GetIdeas,getIdeasProps] = useLazyGetIdeasByProjectQuery()
    const [IdeaPrioritize,ideaPrioritizeProps] = useIdeaPrioritizeMutation()
  
    function mapApiDataToFeatures(apiData: any[]): Feature[] {
      // Guard against null or undefined data
      if (!apiData || !Array.isArray(apiData)) {
        return [];
      }
    
      return apiData.map(idea => {
        // Extract the position data with fallbacks for missing values
        const position = {
          x: idea.prioritization?.position?.x ?? 0,
          y: idea.prioritization?.position?.y ?? 0
        };
    
        // Extract the quadrant with a fallback to 'none'
        const quadrant = idea.prioritization?.quadrant as 'q1' | 'q2' | 'q3' | 'q4' | 'none';
    
        // Create a Feature object that matches the interface
        const feature: Feature = {
          id: idea._id,
          title: idea.title,
          description: idea.description || '',
          quadrant: quadrant,
          position: position
        };
    
        return feature;
      });
    }
  
    useEffect(() => {
      GetIdeas({id:projectDeatils?._id , authToken:authDeatils.token})
    }, [])
    useEffect(() => {
      if (getIdeasProps.isSuccess) {
        // Extract the data from the API response
        const apiData = getIdeasProps.data.data;
        
        // Map the API data to Feature objects
        const mappedFeatures = mapApiDataToFeatures(apiData);

        // if(mappedFeatures.filter(idea => idea.quadrant === 'none').length>0){
        //   IdeaPrioritize({ideas:mappedFeatures.filter(idea => idea.quadrant === 'none')})
        // }
        
        // Update state with the mapped features
        setFeatures(mappedFeatures);
      }
    }, [getIdeasProps.isSuccess]);
    

  const getQuadrantFromPosition = (x: number, y: number): Feature['quadrant'] => {
    const midX = window.innerWidth / 2;
    const midY = 400; 
    
    if (x > midX) {
      return y > midY ? 'q4' : 'q2';
    } else {
      return y > midY ? 'q3' : 'q1';
    }
  };

  const handleAddFeature = () => {
    if (newFeature.title) {
      const feature: Feature = {
        id: Date.now().toString(),
        title: newFeature.title,
        description: newFeature.description,
        quadrant: 'q1',
        position: { x: 100, y: 100 }
      };
      setFeatures([...features, feature]);
      setNewFeature({ title: '', description: '' });
      setShowAddDialog(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, feature: Feature) => {
    setDraggedFeature(feature);
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', feature.id);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedFeature) {
      const gridRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - gridRect.left;
      const y = e.clientY - gridRect.top;
      
      const quadrant = getQuadrantFromPosition(x, y);

      UpdateIdeaPosition({id:draggedFeature.id,authToken:authDeatils.token,body:{
        "quadrant": quadrant,
            "x": x,
            "y": y
        }
    })

      
      const updatedFeatures = features.map(f => 
        f.id === draggedFeature.id
          ? { ...f, position: { x, y }, quadrant }
          : f
      );


      
      setFeatures(updatedFeatures);
      setDraggedFeature(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Impact vs Urgency Grid</h1>
        
      </div>
      <div className='mb-10 w-full justify-center gap-2 flex flex-wrap'>
      {features
            .filter(idea => idea.quadrant === 'none')
            .map(idea => ( <Card
              key={idea.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idea)}
              className=" max-w-48 cursor-move bg-[#0f0f43] border-none"
              style={{
              }}
            >
              <CardContent className="p-4 ">
                <div className="flex items-center gap-2">
                  <GripHorizontal className="w-4 h-4 text-white" />
                  <div>
                    <h3 className="font-medium text-white">{idea.title}</h3>
                    {/* {feature.description && (
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    )} */}
                  </div>
                </div>
              </CardContent>
            </Card>))}
      </div>

      {features.length === 0 ? (
        <EmptyState />
      ) : (
        <div 
          className="relative w-full h-[800px] border border-gray-50 opacity-75 rounded-lg"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Grid lines */}
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 bottom-0 border-l border-white" />
            <div className="absolute top-1/2 left-0 right-0 border-t border-white" />
          </div>

          {/* Quadrant Labels */}
          <div className="absolute top-4 left-4 text-lg font-semibold text-gray-50 opacity-15 ">
            Low Urgency, High Impact
          </div>
          <div className="absolute top-4 right-4 text-lg font-semibold text-gray-50 opacity-15 ">
            High Urgency, High Impact
          </div>
          <div className="absolute bottom-4 left-4 text-lg font-semibold text-gray-50 opacity-15 ">
            Low Urgency, Low Impact
          </div>
          <div className="absolute bottom-4 right-4 text-lg font-semibold text-gray-50 opacity-15 ">
            High Urgency, Low Impact
          </div>

          {/* Axis Labels */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 text-xl font-semibold text-white">
            Impact
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 transform -rotate-90 text-xl text-white font-semibold">
            Urgency
          </div>

          {/* Features */}
          {features.filter(idea => idea.quadrant != 'none').map(feature => (
            <Card
              key={feature.id}
              draggable
              onDragStart={(e) => handleDragStart(e, feature)}
              className="absolute max-w-48 cursor-move bg-[#0f0f43] border-none"
              style={{
                left: `${feature.position.x}px`,
                top: `${feature.position.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <CardContent className="p-4 ">
                <div className="flex items-center gap-2">
                  <GripHorizontal className="w-4 h-4 text-white" />
                  <div>
                    <h3 className="font-medium text-white">{feature.title}</h3>
                   
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorizationGrid;