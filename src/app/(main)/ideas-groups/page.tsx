'use client'
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Brain, MoveDown, MoveUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Idea {
  id: string;
  title: string;
  description: string;
  groupId: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  color: string;
}

const GROUP_COLORS = [
  'bg-red-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-pink-100',
  'bg-indigo-100',
  'bg-orange-100'
];

const IdeaGroupsPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false);
  const [showMoveIdeaDialog, setShowMoveIdeaDialog] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isGeneratingGroups, setIsGeneratingGroups] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    color: GROUP_COLORS[0]
  });

  const handleAddGroup = () => {
    if (newGroup.name) {
      const group: Group = {
        id: Date.now().toString(),
        name: newGroup.name,
        description: newGroup.description,
        color: newGroup.color
      };
      setGroups([...groups, group]);
      setNewGroup({ name: '', description: '', color: GROUP_COLORS[0] });
      setShowAddGroupDialog(false);
    }
  };

  const handleEditGroup = (updatedGroup: Group) => {
    setGroups(groups.map(group =>
      group.id === updatedGroup.id ? updatedGroup : group
    ));
    setEditingGroup(null);
  };

  const handleDeleteGroup = (groupId: string) => {
    // Move ideas to ungrouped
    setIdeas(ideas.map(idea =>
      idea.groupId === groupId ? { ...idea, groupId: 'ungrouped' } : idea
    ));
    setGroups(groups.filter(group => group.id !== groupId));
  };

  const handleMoveIdea = (ideaId: string, newGroupId: string) => {
    setIdeas(ideas.map(idea =>
      idea.id === ideaId ? { ...idea, groupId: newGroupId } : idea
    ));
    setSelectedIdea(null);
    setShowMoveIdeaDialog(false);
  };

  // Simulated AI grouping
  const generateGroups = async () => {
    setIsGeneratingGroups(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Example AI-generated groups
    const suggestedGroups = [
      { name: 'User Experience', description: 'Ideas focused on improving user interactions' },
      { name: 'Technical Optimization', description: 'Performance and architecture improvements' },
      { name: 'Business Value', description: 'Revenue and growth opportunities' },
    ].map((group, index) => ({
      id: `ai-${Date.now()}-${index}`,
      name: group.name,
      description: group.description,
      color: GROUP_COLORS[index % GROUP_COLORS.length]
    }));
    
    setGroups([...groups, ...suggestedGroups]);
    setIsGeneratingGroups(false);
  };

  const renderIdea = (idea: Idea) => {
    const group = groups.find(g => g.id === idea.groupId);
    
    return (
      <Card key={idea.id} className={`w-full ${group?.color || 'bg-gray-50'}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{idea.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedIdea(idea);
                setShowMoveIdeaDialog(true);
              }}
            >
              <MoveDown className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderGroup = (group: Group) => (
    <div key={group.id} className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">{group.name}</h2>
          <p className="text-gray-600">{group.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingGroup(group)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteGroup(group.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas
          .filter(idea => idea.groupId === group.id)
          .map(renderIdea)}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Idea Groups</h1>
        <div className="flex gap-2">
          <Dialog open={showAddGroupDialog} onOpenChange={setShowAddGroupDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Group Name"
                  value={newGroup.name}
                  onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                />
                <Textarea
                  placeholder="Group Description"
                  value={newGroup.description}
                  onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                  className="h-24"
                />
                <Select
                  value={newGroup.color}
                  onValueChange={value => setNewGroup({ ...newGroup, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Color" />
                  </SelectTrigger>
                  <SelectContent>
                    {GROUP_COLORS.map(color => (
                      <SelectItem key={color} value={color}>
                        <div className={`w-full h-8 rounded ${color}`} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddGroup}
                  className="w-full"
                  disabled={!newGroup.name}
                >
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="secondary"
            onClick={generateGroups}
            disabled={isGeneratingGroups}
          >
            <Brain className="w-4 h-4 mr-2" />
            {isGeneratingGroups ? 'Generating...' : 'Generate Groups (AI)'}
          </Button>
        </div>
      </div>

      {groups.length === 0 ? (
        <Alert>
          <AlertDescription>
            No groups created yet. Click "Add Group" to create one manually, or "Generate Groups" to use AI assistance.
          </AlertDescription>
        </Alert>
      ) : (
        <div>
          {groups.map(renderGroup)}
          
          {/* Ungrouped Ideas */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Ungrouped Ideas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ideas
                .filter(idea => !idea.groupId || idea.groupId === 'ungrouped')
                .map(renderIdea)}
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Dialog */}
      <Dialog open={!!editingGroup} onOpenChange={(open) => !open && setEditingGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          {editingGroup && (
            <div className="space-y-4">
              <Input
                value={editingGroup.name}
                onChange={e => setEditingGroup({ ...editingGroup, name: e.target.value })}
                placeholder="Group Name"
              />
              <Textarea
                value={editingGroup.description}
                onChange={e => setEditingGroup({ ...editingGroup, description: e.target.value })}
                placeholder="Group Description"
                className="h-24"
              />
              <Select
                value={editingGroup.color}
                onValueChange={value => setEditingGroup({ ...editingGroup, color: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  {GROUP_COLORS.map(color => (
                    <SelectItem key={color} value={color}>
                      <div className={`w-full h-8 rounded ${color}`} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => handleEditGroup(editingGroup)}
                  disabled={!editingGroup.name}
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
                <Button variant="ghost" onClick={() => setEditingGroup(null)}>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Move Idea Dialog */}
      <Dialog open={showMoveIdeaDialog} onOpenChange={setShowMoveIdeaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Idea to Different Group</DialogTitle>
          </DialogHeader>
          {selectedIdea && (
            <div className="space-y-4">
              <h3 className="font-medium">{selectedIdea.title}</h3>
              <Select
                onValueChange={value => handleMoveIdea(selectedIdea.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ungrouped">Ungrouped</SelectItem>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IdeaGroupsPage;