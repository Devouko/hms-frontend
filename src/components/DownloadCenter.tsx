import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, File, FileText, Image, Archive, Trash2, Eye, Search, Filter, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface DownloadFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'archive' | 'report' | 'template';
  category: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
  description?: string;
  url: string;
  isPublic: boolean;
}

interface FileCategory {
  id: string;
  name: string;
  description: string;
  fileCount: number;
}

export function DownloadCenter() {
  const [files, setFiles] = useState<DownloadFile[]>([]);
  const [categories, setCategories] = useState<FileCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: '',
    type: 'document' as 'document' | 'image' | 'archive' | 'report' | 'template',
    description: '',
    isPublic: true,
    file: null as File | null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load files and categories
    setFiles([
      {
        id: '1',
        name: 'Patient Registration Form.pdf',
        type: 'document',
        category: 'Forms',
        size: 245760,
        uploadedBy: 'Admin',
        uploadedAt: '2024-01-15T10:00:00Z',
        downloadCount: 45,
        description: 'Standard patient registration form',
        url: '/downloads/patient-registration-form.pdf',
        isPublic: true
      },
      {
        id: '2',
        name: 'Monthly Report Template.xlsx',
        type: 'template',
        category: 'Templates',
        size: 102400,
        uploadedBy: 'Dr. Smith',
        uploadedAt: '2024-01-14T15:30:00Z',
        downloadCount: 23,
        description: 'Template for monthly department reports',
        url: '/downloads/monthly-report-template.xlsx',
        isPublic: false
      },
      {
        id: '3',
        name: 'Hospital Policies.zip',
        type: 'archive',
        category: 'Policies',
        size: 1048576,
        uploadedBy: 'HR Department',
        uploadedAt: '2024-01-13T09:00:00Z',
        downloadCount: 67,
        description: 'Complete hospital policies and procedures',
        url: '/downloads/hospital-policies.zip',
        isPublic: true
      }
    ]);

    setCategories([
      { id: 'forms', name: 'Forms', description: 'Patient and administrative forms', fileCount: 12 },
      { id: 'templates', name: 'Templates', description: 'Document templates', fileCount: 8 },
      { id: 'policies', name: 'Policies', description: 'Hospital policies and procedures', fileCount: 15 },
      { id: 'reports', name: 'Reports', description: 'Generated reports and analytics', fileCount: 25 },
      { id: 'manuals', name: 'Manuals', description: 'User manuals and guides', fileCount: 6 }
    ]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="size-4" />;
      case 'image':
        return <Image className="size-4" />;
      case 'archive':
        return <Archive className="size-4" />;
      default:
        return <File className="size-4" />;
    }
  };

  const handleFileUpload = async () => {
    if (!uploadForm.file || !uploadForm.name || !uploadForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate file upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Wait for upload to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newFile: DownloadFile = {
        id: Date.now().toString(),
        name: uploadForm.name,
        type: uploadForm.type,
        category: uploadForm.category,
        size: uploadForm.file.size,
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString(),
        downloadCount: 0,
        description: uploadForm.description,
        url: `/downloads/${uploadForm.file.name}`,
        isPublic: uploadForm.isPublic
      };

      setFiles(prev => [newFile, ...prev]);
      
      // Reset form
      setUploadForm({
        name: '',
        category: '',
        type: 'document',
        description: '',
        isPublic: true,
        file: null
      });
      
      setShowUploadDialog(false);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (file: DownloadFile) => {
    try {
      // Increment download count
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, downloadCount: f.downloadCount + 1 } : f
      ));
      
      // Simulate file download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category.toLowerCase() === selectedCategory;
    const matchesType = selectedType === 'all' || file.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Download className="size-8 text-primary" />
              Download Center
            </h1>
            <p className="text-muted-foreground mt-1">Manage and download hospital documents, forms, and resources</p>
          </div>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="size-4 mr-2" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload New File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>File Name *</Label>
                    <Input
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter file name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={uploadForm.category}
                      onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>File Type</Label>
                    <Select
                      value={uploadForm.type}
                      onValueChange={(value: any) => setUploadForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="archive">Archive</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Select
                      value={uploadForm.isPublic ? 'public' : 'private'}
                      onValueChange={(value) => setUploadForm(prev => ({ ...prev, isPublic: value === 'public' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter file description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select File *</Label>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadForm(prev => ({ 
                          ...prev, 
                          file,
                          name: prev.name || file.name
                        }));
                      }
                    }}
                  />
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <Label>Upload Progress</Label>
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleFileUpload} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{files.length}</p>
              </div>
              <File className="size-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <FolderOpen className="size-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                <p className="text-2xl font-bold">{files.reduce((sum, file) => sum + file.downloadCount, 0)}</p>
              </div>
              <Download className="size-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-bold">{formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}</p>
              </div>
              <Archive className="size-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.name.toLowerCase()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="archive">Archives</SelectItem>
            <SelectItem value="report">Reports</SelectItem>
            <SelectItem value="template">Templates</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Files ({filteredFiles.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="font-medium">{file.name}</div>
                        {file.description && (
                          <div className="text-sm text-muted-foreground">{file.description}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{file.type}</Badge>
                  </TableCell>
                  <TableCell>{file.category}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>{file.uploadedBy}</TableCell>
                  <TableCell>{file.downloadCount}</TableCell>
                  <TableCell>{new Date(file.uploadedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>File Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{category.name}</h3>
                  <Badge variant="secondary">{category.fileCount} files</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


