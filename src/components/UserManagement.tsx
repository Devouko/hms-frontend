import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Shield, ShieldAlert, Edit, Trash2, UserPlus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface UserManagementProps {
  session: any;
}

export function UserManagement({ session }: UserManagementProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'user' });

  const userRole = session?.user?.user_metadata?.role || 'user';
  const isSuperAdmin = userRole === 'super_admin';

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d8a3a34f/users`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d8a3a34f/users/${selectedUser.id}/role`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      await fetchUsers();
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole('');
      toast.success('User role updated successfully!');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleCreateUser = async () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      toast.error('Please fill all required fields (Name, Email, Password)');
      return;
    }

    if (newUserData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d8a3a34f/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(newUserData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }

      await fetchUsers();
      setShowCreateModal(false);
      setNewUserData({ name: '', email: '', password: '', role: 'user' });
      toast.success(`User created successfully! Welcome ${newUserData.name}`);
    } catch (error: any) {
      toast.error(`Failed to create user: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d8a3a34f/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      await fetchUsers();
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <ShieldAlert className="size-5 text-destructive" />;
      case 'admin':
        return <Shield className="size-5 text-warning" />;
      default:
        return <Users className="size-5 text-primary" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'admin':
        return 'bg-warning/10 text-warning border-warning/30';
      default:
        return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-gray-900">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Users className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <h3 className="text-gray-900">{users.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="bg-warning/10 p-3 rounded-xl">
                  <Shield className="size-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admins</p>
                  <h3 className="text-gray-900">
                    {users.filter((u) => u.role === 'admin').length}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="bg-destructive/10 p-3 rounded-xl">
                  <ShieldAlert className="size-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Super Admins</p>
                  <h3 className="text-gray-900">
                    {users.filter((u) => u.role === 'super_admin').length}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>All Users</CardTitle>
              <div className="flex items-center gap-2 text-xs text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Live
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isSuperAdmin && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <UserPlus className="size-4 mr-2" />
                  Create User
                </Button>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-card-foreground">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4 className="text-gray-900">{user.name || 'Unknown'}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm border ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role === 'super_admin'
                        ? 'Super Admin'
                        : user.role === 'admin'
                        ? 'Admin'
                        : user.role === 'doctor'
                        ? 'Doctor'
                        : user.role === 'nurse'
                        ? 'Nurse'
                        : user.role === 'pharmacist'
                        ? 'Pharmacist'
                        : user.role === 'lab_technician'
                        ? 'Lab Technician'
                        : user.role === 'receptionist'
                        ? 'Receptionist'
                        : 'User'}
                    </span>
                  </div>

                  {isSuperAdmin && user.id !== session.user.id && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedUser(user);
                          setNewRole(user.role);
                          setShowRoleModal(true);
                        }}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Update Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-gray-900 mb-4">Update User Role</h3>
            <div className="space-y-4">
              <div>
                <Label>User</Label>
                <Input value={selectedUser?.email} disabled />
              </div>
              <div>
                <Label>Role</Label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card"
                >
                  <option value="user">User</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="lab_technician">Lab Technician</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateRole} className="flex-1 bg-primary hover:bg-primary/90">
                  Update Role
                </Button>
                <Button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                    setNewRole('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-gray-900 mb-4">Create New User</h3>
            <div className="space-y-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <Label>Password * (min 6 characters)</Label>
                <Input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  placeholder="Enter password"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <Label>Role</Label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card"
                >
                  <option value="user">User</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="lab_technician">Lab Technician</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateUser} 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={!newUserData.name || !newUserData.email || !newUserData.password || newUserData.password.length < 6}
                >
                  Create User
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewUserData({ name: '', email: '', password: '', role: 'user' });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
