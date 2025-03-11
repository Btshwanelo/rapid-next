'use client'
import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Brain, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EmptyState from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/badge';
import { useLazyGetIdeasByProjectQuery, useUpdateIdeaMutation } from '@/services/ideaService';
import useProject from '@/hooks/useProject';
import useAuth from '@/hooks/useAuth';

interface Feature {
  id: string;
  title: string;
  description: string;
  timeline: 'near term' | 'mid term' | 'long term'|'none';
  group?: string;
}

const ExperienceMap = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [newFeature, setNewFeature] = useState<Partial<Feature>>({
    title: '',
    description: '',
    timeline: 'none'
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isGrouped, setIsGrouped] = useState(false);

  const projectDetails = useProject();
  const authDetails = useAuth();

  // Use RTK Query hooks
  const [getIdeas, getIdeasProps] = useLazyGetIdeasByProjectQuery();
  const [updateIdea, updateIdeaProps] = useUpdateIdeaMutation();

  // Fetch ideas when component mounts
  useEffect(() => {
    if (projectDetails?._id && authDetails.token) {
      fetchIdeas();
    }
  }, [projectDetails?._id, authDetails.token]);

  // Fetch ideas after successful idea update
  useEffect(() => {
    if (updateIdeaProps.isSuccess) {
      fetchIdeas();
    }
  }, [updateIdeaProps.isSuccess]);

  // Update features state when API data is fetched
  useEffect(() => {
    if (getIdeasProps.isSuccess && getIdeasProps.data) {
      const mappedFeatures = mapApiDataToFeatures(getIdeasProps.data.data);
      setFeatures(mappedFeatures);
    }
  }, [getIdeasProps.data, getIdeasProps.isSuccess]);

  // Function to fetch ideas
  const fetchIdeas = () => {
    if (!projectDetails?._id || !authDetails.token) return;
    
    getIdeas({
      id: projectDetails._id,
      authToken: authDetails.token
    });
  };

  function mapApiDataToFeatures(apiData: any[]): Feature[] {
    // Guard against null or undefined data
    if (!apiData || !Array.isArray(apiData)) {
      return [];
    }
  
    return apiData.map(idea => {
      // Create a Feature object that matches the interface
      const feature: Feature = {
        id: idea._id,
        title: idea.title,
        description: idea.description || '',
        timeline: idea.timeline,
      };
  
      return feature;
    });
  }

  const handleEditFeature = (feature: Feature) => {
    if (!authDetails.token) return;

    // Update the idea in the backend
    updateIdea({
      id: feature.id,
      authToken: authDetails.token,
      body: { timeline: feature.timeline }
    });

    // Clear editing state
    setEditingFeature(null);
  };

  const handleDeleteFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const simulateAIGrouping = () => {
    // Simulated AI grouping - in reality, this would call an API
    const groups = ['User Interface', 'Performance', 'Security'];
    const groupedFeatures = features.map(feature => ({
      ...feature,
      group: groups[Math.floor(Math.random() * groups.length)]
    }));
    setFeatures(groupedFeatures);
    setIsGrouped(true);
  };

  const removeGroups = () => {
    const ungroupedFeatures = features.map(({ group, ...feature }) => feature);
    setFeatures(ungroupedFeatures);
    setIsGrouped(false);
  };

  const timelineColors = {
    'near term': 'bg-green-100',
    'mid term': 'bg-yellow-100',
    'long term': 'bg-red-100',
    'none': 'bg-red-100'
  };

  const renderFeatures = () => {
    if (isGrouped) {
      const groupedFeatures = features.reduce((acc, feature) => {
        const group = feature.group || 'Ungrouped';
        if (!acc[group]) acc[group] = [];
        acc[group].push(feature);
        return acc;
      }, {} as Record<string, Feature[]>);

      return Object.entries(groupedFeatures).map(([group, groupFeatures]) => (
        <div key={group} className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">{group}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupFeatures.map(renderFeatureCard)}
          </div>
        </div>
      ));
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {features.map(renderFeatureCard)}
      </div>
    );
  };

  const renderFeatureCard = (feature: Feature) => (
    <Card key={feature.id} className="w-full bg-[#0f0f43] border-none text-white">
      <CardHeader className={`${timelineColors[feature.timeline]} p-4 rounded-t-sm`}>
        <CardTitle className="text-lg text-gray-700">
          {feature.title}
        </CardTitle>
        <Badge variant="secondary" className={`w-fit ${timelineColors[feature.timeline]}`}>
          <Sparkles className="w-3 h-3 mr-1" />
          {feature.timeline}
        </Badge>
      </CardHeader>
      <CardContent className="p-4">
        {editingFeature?.id === feature.id ? (
          <>
            <Select
              value={editingFeature.timeline}
              onValueChange={value => setEditingFeature({ ...editingFeature, timeline: value as Feature['timeline'] })}
            >
              <SelectTrigger className="text-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="near term">Near Term</SelectItem>
                <SelectItem value="mid term">Mid Term</SelectItem>
                <SelectItem value="long term">Long Term</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={() => handleEditFeature(editingFeature)}>
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingFeature(null)}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4">{feature.description}</p>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setEditingFeature(feature)}>
                <Edit2 className="w-4 h-4" /> Edit
              </Button>
              {/* Uncomment if delete functionality is needed
              <Button size="sm" variant="ghost" onClick={() => handleDeleteFeature(feature.id)}>
                <Trash2 className="w-4 h-4" /> Delete
              </Button> */}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Experience Map</h1>
        <div className="flex gap-4">
          {/* Uncomment if add feature dialog is needed
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
                <Select
                  value={newFeature.timeline}
                  onValueChange={value => setNewFeature({ ...newFeature, timeline: value as Feature['timeline'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="near term">Near Term</SelectItem>
                    <SelectItem value="mid term">Mid Term</SelectItem>
                    <SelectItem value="long term">Long Term</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddFeature} className="w-full">
                  Add Feature
                </Button>
              </div>
            </DialogContent>
          </Dialog> */}
          
          {/* Uncomment if AI grouping is needed
          <Button
            variant={isGrouped ? "destructive" : "secondary"}
            onClick={isGrouped ? removeGroups : simulateAIGrouping}
          >
            <Brain className="w-4 h-4 mr-2" />
            {isGrouped ? 'Remove Groups' : 'Group Features (AI)'}
          </Button> */}
        </div>
      </div>

      {getIdeasProps.isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-white">Loading ideas...</p>
        </div>
      ) : features.length === 0 ? (
        <EmptyState />
      ) : (
        renderFeatures()
      )}

      {updateIdeaProps.isError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            Failed to update idea. Please try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ExperienceMap;