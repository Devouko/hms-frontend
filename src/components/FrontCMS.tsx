import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Edit, Plus, Trash2, Eye, Image, FileText, Menu, Settings, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft' | 'archived';
  type: 'page' | 'post' | 'service';
  author: string;
  createdAt: string;
  updatedAt: string;
  isHomepage: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

interface MenuItem {
  id: string;
  title: string;
  url: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  children?: MenuItem[];
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText?: string;
  buttonUrl?: string;
  isActive: boolean;
  order: number;
}

interface Gallery {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  isActive: boolean;
  createdAt: string;
}

export function FrontCMS() {
  const [pages, setPages] = useState<Page[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [activeTab, setActiveTab] = useState('pages');
  const [showPageDialog, setShowPageDialog] = useState(false);
  const [showMenuDialog, setShowMenuDialog] = useState(false);
  const [showBannerDialog, setShowBannerDialog] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [editingBanner, setBanner] = useState<Banner | null>(null);

  const [pageForm, setPageForm] = useState<Partial<Page>>({
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    type: 'page',
    isHomepage: false,
    metaTitle: '',
    metaDescription: ''
  });

  const [menuForm, setMenuForm] = useState<Partial<MenuItem>>({
    title: '',
    url: '',
    parentId: '',
    order: 0,
    isActive: true
  });

  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    image: '',
    buttonText: '',
    buttonUrl: '',
    isActive: true,
    order: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load CMS data
    setPages([
      {
        id: '1',
        title: 'Home',
        slug: 'home',
        content: 'Welcome to our hospital. We provide excellent healthcare services.',
        status: 'published',
        type: 'page',
        author: 'Admin',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        isHomepage: true,
        metaTitle: 'SmartCare Hospital - Quality Healthcare',
        metaDescription: 'Leading healthcare provider with modern facilities and expert medical staff.'
      },
      {
        id: '2',
        title: 'About Us',
        slug: 'about',
        content: 'Our hospital has been serving the community for over 20 years.',
        status: 'published',
        type: 'page',
        author: 'Admin',
        createdAt: '2024-01-14T15:30:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
        isHomepage: false
      }
    ]);

    setMenuItems([
      { id: '1', title: 'Home', url: '/', order: 1, isActive: true },
      { id: '2', title: 'About Us', url: '/about', order: 2, isActive: true },
      { id: '3', title: 'Services', url: '/services', order: 3, isActive: true },
      { id: '4', title: 'Contact', url: '/contact', order: 4, isActive: true }
    ]);

    setBanners([
      {
        id: '1',
        title: 'Welcome to SmartCare Hospital',
        subtitle: 'Providing quality healthcare with compassion',
        image: '/images/banner1.jpg',
        buttonText: 'Learn More',
        buttonUrl: '/about',
        isActive: true,
        order: 1
      }
    ]);

    setGalleries([
      {
        id: '1',
        title: 'Hospital Facilities',
        description: 'Modern medical equipment and comfortable patient rooms',
        images: ['/images/facility1.jpg', '/images/facility2.jpg'],
        category: 'Facilities',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z'
      }
    ]);
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handlePageSubmit = async () => {
    try {
      if (!pageForm.title || !pageForm.content) {
        toast.error('Please fill in required fields');
        return;
      }

      const slug = pageForm.slug || generateSlug(pageForm.title);

      if (editingPage) {
        // Update existing page
        setPages(prev => prev.map(page => 
          page.id === editingPage.id 
            ? { ...page, ...pageForm, slug, updatedAt: new Date().toISOString() }
            : page
        ));
        toast.success('Page updated successfully');
      } else {
        // Create new page
        const newPage: Page = {
          ...pageForm as Page,
          id: Date.now().toString(),
          slug,
          author: 'Current User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setPages(prev => [newPage, ...prev]);
        toast.success('Page created successfully');
      }
      
      setShowPageDialog(false);
      setEditingPage(null);
      setPageForm({
        title: '',
        slug: '',
        content: '',
        status: 'draft',
        type: 'page',
        isHomepage: false,
        metaTitle: '',
        metaDescription: ''
      });
    } catch (error) {
      toast.error('Failed to save page');
    }
  };

  const handleMenuSubmit = async () => {
    try {
      if (!menuForm.title || !menuForm.url) {
        toast.error('Please fill in required fields');
        return;
      }

      if (editingMenu) {
        // Update existing menu item
        setMenuItems(prev => prev.map(item => 
          item.id === editingMenu.id ? { ...item, ...menuForm } : item
        ));
        toast.success('Menu item updated successfully');
      } else {
        // Create new menu item
        const newMenuItem: MenuItem = {
          ...menuForm as MenuItem,
          id: Date.now().toString()
        };
        setMenuItems(prev => [...prev, newMenuItem]);
        toast.success('Menu item created successfully');
      }
      
      setShowMenuDialog(false);
      setEditingMenu(null);
      setMenuForm({
        title: '',
        url: '',
        parentId: '',
        order: 0,
        isActive: true
      });
    } catch (error) {
      toast.error('Failed to save menu item');
    }
  };

  const handleBannerSubmit = async () => {
    try {
      if (!bannerForm.title || !bannerForm.image) {
        toast.error('Please fill in required fields');
        return;
      }

      if (editingBanner) {
        // Update existing banner
        setBanners(prev => prev.map(banner => 
          banner.id === editingBanner.id ? { ...banner, ...bannerForm } : banner
        ));
        toast.success('Banner updated successfully');
      } else {
        // Create new banner
        const newBanner: Banner = {
          ...bannerForm as Banner,
          id: Date.now().toString()
        };
        setBanners(prev => [...prev, newBanner]);
        toast.success('Banner created successfully');
      }
      
      setShowBannerDialog(false);
      setBanner(null);
      setBannerForm({
        title: '',
        subtitle: '',
        image: '',
        buttonText: '',
        buttonUrl: '',
        isActive: true,
        order: 0
      });
    } catch (error) {
      toast.error('Failed to save banner');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    try {
      setPages(prev => prev.filter(page => page.id !== pageId));
      toast.success('Page deleted successfully');
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Menu item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    try {
      setBanners(prev => prev.filter(banner => banner.id !== bannerId));
      toast.success('Banner deleted successfully');
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Globe className="size-8 text-primary" />
              Front CMS
            </h1>
            <p className="text-muted-foreground mt-1">Manage hospital website content and appearance</p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="menus">Menus</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Website Pages</h2>
            <Dialog open={showPageDialog} onOpenChange={setShowPageDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingPage(null);
                  setPageForm({
                    title: '',
                    slug: '',
                    content: '',
                    status: 'draft',
                    type: 'page',
                    isHomepage: false,
                    metaTitle: '',
                    metaDescription: ''
                  });
                }}>
                  <Plus className="size-4 mr-2" />
                  Add Page
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPage ? 'Edit Page' : 'Add New Page'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Page Title *</Label>
                      <Input
                        value={pageForm.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setPageForm(prev => ({ 
                            ...prev, 
                            title,
                            slug: generateSlug(title)
                          }));
                        }}
                        placeholder="Enter page title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL Slug</Label>
                      <Input
                        value={pageForm.slug}
                        onChange={(e) => setPageForm(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="page-url-slug"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={pageForm.status}
                        onValueChange={(value: 'published' | 'draft' | 'archived') => 
                          setPageForm(prev => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={pageForm.type}
                        onValueChange={(value: 'page' | 'post' | 'service') => 
                          setPageForm(prev => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="page">Page</SelectItem>
                          <SelectItem value="post">Post</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Homepage</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch
                          checked={pageForm.isHomepage}
                          onCheckedChange={(checked) => 
                            setPageForm(prev => ({ ...prev, isHomepage: checked }))
                          }
                        />
                        <span className="text-sm">Set as homepage</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Page Content *</Label>
                    <Textarea
                      value={pageForm.content}
                      onChange={(e) => setPageForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter page content"
                      rows={10}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Meta Title</Label>
                      <Input
                        value={pageForm.metaTitle}
                        onChange={(e) => setPageForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                        placeholder="SEO meta title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Meta Description</Label>
                      <Input
                        value={pageForm.metaDescription}
                        onChange={(e) => setPageForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                        placeholder="SEO meta description"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setShowPageDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePageSubmit}>
                    {editingPage ? 'Update' : 'Create'} Page
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="size-4" />
                          <div>
                            <div className="font-medium">{page.title}</div>
                            {page.isHomepage && (
                              <Badge variant="secondary" className="text-xs">Homepage</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">/{page.slug}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{page.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            page.status === 'published' ? 'default' :
                            page.status === 'draft' ? 'secondary' : 'destructive'
                          }
                        >
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{page.author}</TableCell>
                      <TableCell>{new Date(page.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPage(page);
                              setPageForm(page);
                              setShowPageDialog(true);
                            }}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePage(page.id)}
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
        </TabsContent>

        <TabsContent value="menus" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Navigation Menus</h2>
            <Dialog open={showMenuDialog} onOpenChange={setShowMenuDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingMenu(null);
                  setMenuForm({
                    title: '',
                    url: '',
                    parentId: '',
                    order: menuItems.length + 1,
                    isActive: true
                  });
                }}>
                  <Plus className="size-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingMenu ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Menu Title *</Label>
                    <Input
                      value={menuForm.title}
                      onChange={(e) => setMenuForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter menu title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL *</Label>
                    <Input
                      value={menuForm.url}
                      onChange={(e) => setMenuForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="/page-url or https://external-link.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={menuForm.order}
                        onChange={(e) => setMenuForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Active</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch
                          checked={menuForm.isActive}
                          onCheckedChange={(checked) => setMenuForm(prev => ({ ...prev, isActive: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setShowMenuDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleMenuSubmit}>
                    {editingMenu ? 'Update' : 'Create'} Menu Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Menu className="size-4" />
                            {item.title}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.url}</TableCell>
                        <TableCell>{item.order}</TableCell>
                        <TableCell>
                          <Badge variant={item.isActive ? 'default' : 'secondary'}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingMenu(item);
                                setMenuForm(item);
                                setShowMenuDialog(true);
                              }}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMenuItem(item.id)}
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
        </TabsContent>

        <TabsContent value="banners" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Homepage Banners</h2>
            <Dialog open={showBannerDialog} onOpenChange={setShowBannerDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setBanner(null);
                  setBannerForm({
                    title: '',
                    subtitle: '',
                    image: '',
                    buttonText: '',
                    buttonUrl: '',
                    isActive: true,
                    order: banners.length + 1
                  });
                }}>
                  <Plus className="size-4 mr-2" />
                  Add Banner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Banner Title *</Label>
                    <Input
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter banner title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Enter banner subtitle"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL *</Label>
                    <Input
                      value={bannerForm.image}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="Enter image URL"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Button Text</Label>
                      <Input
                        value={bannerForm.buttonText}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, buttonText: e.target.value }))}
                        placeholder="Learn More"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Button URL</Label>
                      <Input
                        value={bannerForm.buttonUrl}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, buttonUrl: e.target.value }))}
                        placeholder="/about"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={bannerForm.order}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Active</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch
                          checked={bannerForm.isActive}
                          onCheckedChange={(checked) => setBannerForm(prev => ({ ...prev, isActive: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setShowBannerDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBannerSubmit}>
                    {editingBanner ? 'Update' : 'Create'} Banner
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {banners
              .sort((a, b) => a.order - b.order)
              .map((banner) => (
                <Card key={banner.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <Image className="size-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{banner.title}</h3>
                          <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                              {banner.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Order: {banner.order}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setBanner(banner);
                            setBannerForm(banner);
                            setShowBannerDialog(true);
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {galleries.map((gallery) => (
                  <div key={gallery.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{gallery.title}</h3>
                      <Badge variant="outline">{gallery.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{gallery.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {gallery.images.length} images
                      </span>
                      <Badge variant={gallery.isActive ? 'default' : 'secondary'}>
                        {gallery.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Site Title</Label>
                    <Input defaultValue="SmartCare Hospital" />
                  </div>
                  <div className="space-y-2">
                    <Label>Site Tagline</Label>
                    <Input defaultValue="Quality Healthcare with Compassion" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Site Description</Label>
                  <Textarea 
                    defaultValue="Leading healthcare provider with modern facilities and expert medical staff."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input defaultValue="info@smartcare.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

