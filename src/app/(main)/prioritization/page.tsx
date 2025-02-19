'use client'
import React, { useState } from 'react';
import { Plus, GripHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EmptyState from '@/components/ui/EmptyState';

interface Feature {
  id: string;
  title: string;
  description: string;
  quadrant: 'q1' | 'q2' | 'q3' | 'q4';
  position: { x: number; y: number };
}

const PriorizationGrid = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [draggedFeature, setDraggedFeature] = useState<Feature | null>(null);

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
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Feature
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Feature</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Feature Title"
                value={newFeature.title}
                onChange={e => setNewFeature({ ...newFeature, title: e.target.value })}
              />
              <Input
                placeholder="Feature Description"
                value={newFeature.description}
                onChange={e => setNewFeature({ ...newFeature, description: e.target.value })}
              />
              <Button onClick={handleAddFeature} className="w-full">
                Add Feature
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {features.length === 0 ? (
        <EmptyState />
      ) : (
        <div 
          className="relative w-full h-[800px] border-2 border-gray-50 rounded-lg"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Grid lines */}
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-white" />
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-white" />
          </div>

          {/* Quadrant Labels */}
          <div className="absolute top-4 left-4 text-lg font-semibold text-white">
            Low Impact, High Urgency
          </div>
          <div className="absolute top-4 right-4 text-lg font-semibold text-white">
            High Impact, High Urgency
          </div>
          <div className="absolute bottom-4 left-4 text-lg font-semibold text-white">
            Low Impact, Low Urgency
          </div>
          <div className="absolute bottom-4 right-4 text-lg font-semibold text-white">
            High Impact, Low Urgency
          </div>

          {/* Axis Labels */}
          <div className="absolute left-1/2 top-2 -translate-x-1/2 text-xl font-bold text-white">
            Impact
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 transform -rotate-90 text-xl text-white font-bold">
            Urgency
          </div>

          {/* Features */}
          {features.map(feature => (
            <Card
              key={feature.id}
              draggable
              onDragStart={(e) => handleDragStart(e, feature)}
              className="absolute max-w-48 cursor-move bg-inherit border-none"
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
                    {/* {feature.description && (
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    )} */}
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