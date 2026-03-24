import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Trash2, Edit, Plus, Search, Baby, FileText } from 'lucide-react';
import { useSetupData, BaseSetupItem } from './useSetupData';

interface CustomField extends BaseSetupItem {
  name: string;
  visibleOnPrint: boolean;
  type: 'birth' | 'death';
}

const birthFieldsConfig = {
  storageKey: 'birth_custom_fields',
  defaultItems: [
    { id: '1', name: 'Birth Weight', visibleOnPrint: true, type: 'birth' as const, isActive: true, createdAt: new Date().toISOString() },
    { id: '2', name: 'Birth Time', visibleOnPrint: true, type: 'birth' as const, isActive: true, createdAt: new Date().toISOString() },
    { id: '3', name: 'Delivery Type', visibleOnPrint: false, type: 'birth' as const, isActive: true, createdAt: new Date().toISOString() }
  ],
  searchFields: ['name' as keyof CustomField]
};

const deathFieldsConfig = {
  storageKey: 'death_custom_fields',
  defaultItems: [
    { id: '1', name: 'Cause of Death', visibleOnPrint: true, type: 'death' as const, isActive: true, createdAt: new Date().toISOString() },
    { id: '2', name: 'Time of Death', visibleOnPrint: true, type: 'death' as const, isActive: true, createdAt: new Date().toISOString() },
    { id: '3', name: 'Attending Physician', visibleOnPrint: false, type: 'death' as const, isActive: true, createdAt: new Date().toISOString() }
  ],
  searchFields: ['name' as keyof CustomField]
};

export default function BirthDeathRecordSetup() {
  const [activeTab, setActiveTab] = useState('birth');
  
  const birthFields = useSetupData<CustomField>(birthFieldsConfig);
  const deathFields = useSetupData<CustomField>(deathFieldsConfig);
  
  const [formData, setFormData] = useState({ name: '', visibleOnPrint: false });

  const currentFields = activeTab === 'birth' ? birthFields : deathFields;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (currentFields.editingItem) {
      currentFields.updateItem(currentFields.editingItem.id, {
        name: formData.name.trim(),
        visibleOnPrint: formData.visibleOnPrint
      });
    } else {
      currentFields.addItem({
        name: formData.name.trim(),
        visibleOnPrint: formData.visibleOnPrint,
        type: activeTab as 'birth' | 'death'
      });
    }
    
    resetForm();
    currentFields.setIsDialogOpen(false);
  };

  const handleEdit = (field: CustomField) => {
    currentFields.setEditingItem(field);
    setFormData({ name: field.name, visibleOnPrint: field.visibleOnPrint });
    currentFields.setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', visibleOnPrint: false });
    currentFields.setEditingItem(null);
  };

  const renderFieldCard = (field: CustomField) => (
    <Card key={field.id} className={`border-l-4 ${field.isActive ? 'border-l-green-500' : 'border-l-gray-400'}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {activeTab === 'birth' ? 
              <Baby className={`w-5 h-5 ${field.isActive ? 'text-pink-600' : 'text-gray-400'}`} /> :
              <FileText className={`w-5 h-5 ${field.isActive ? 'text-gray-600' : 'text-gray-400'}`} />
            }
            <span className={field.isActive ? '' : 'text-gray-600'}>{field.name}</span>
            {field.visibleOnPrint && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Print Visible
              </span>
            )}
            <span className={`px-2 py-1 text-xs rounded-full ${
              field.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {field.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => currentFields.toggleStatus(field.id)}
              className={field.isActive ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
            >
              {field.isActive ? 'Disable' : 'Enable'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEdit(field)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => currentFields.deleteItem(field.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Birth & Death Record Setup</h2>
          <p className="text-gray-600">Manage custom fields for birth and death certificates</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search fields..."
            value={currentFields.searchTerm}
            onChange={(e) => currentFields.setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Baby className="h-8 w-8 text-pink-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Birth Record Fields</p>
              <p className="text-2xl font-bold">{birthFields.items.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <FileText className="h-8 w-8 text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Death Record Fields</p>
              <p className="text-2xl font-bold">{deathFields.items.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="birth">Birth Record Custom Fields</TabsTrigger>
          <TabsTrigger value="death">Death Record Custom Fields</TabsTrigger>
        </TabsList>

        <TabsContent value="birth" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Birth Record Fields ({birthFields.filteredItems.length})</h3>
            <Dialog open={birthFields.isDialogOpen} onOpenChange={birthFields.setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {currentFields.editingItem ? 'Edit Birth Record Field' : 'Add Birth Record Field'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fieldName">Field Name *</Label>
                    <Input
                      id="fieldName"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter field name"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visibleOnPrint"
                      checked={formData.visibleOnPrint}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visibleOnPrint: !!checked }))}
                    />
                    <Label htmlFor="visibleOnPrint">Visibility On Print</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => birthFields.setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {currentFields.editingItem ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {birthFields.filteredItems.map(renderFieldCard)}
          </div>
        </TabsContent>

        <TabsContent value="death" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Death Record Fields ({deathFields.filteredItems.length})</h3>
            <Dialog open={deathFields.isDialogOpen} onOpenChange={deathFields.setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {currentFields.editingItem ? 'Edit Death Record Field' : 'Add Death Record Field'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fieldName">Field Name *</Label>
                    <Input
                      id="fieldName"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter field name"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visibleOnPrint"
                      checked={formData.visibleOnPrint}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visibleOnPrint: !!checked }))}
                    />
                    <Label htmlFor="visibleOnPrint">Visibility On Print</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => deathFields.setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {currentFields.editingItem ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {deathFields.filteredItems.map(renderFieldCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
