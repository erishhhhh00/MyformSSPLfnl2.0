import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Trash2, Loader2, Shield, UserCheck, Eye, EyeOff } from 'lucide-react';

interface UserProfile {
    id: string;
    email: string;
    role: 'admin' | 'assessor' | 'moderator';
    name: string;
    created_at: string;
}

const UserManagement: React.FC = () => {
    const { token, user } = useAuth();
    const { toast } = useToast();

    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Create user form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'assessor' as 'assessor' | 'moderator'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [creating, setCreating] = useState(false);

    // Load users on mount
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${api.baseUrl}/api/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Failed to load users');
            }
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
            return;
        }

        if (formData.password.length < 6) {
            toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
            return;
        }

        setCreating(true);

        try {
            const response = await fetch(`${api.baseUrl}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast({ title: 'Success', description: `${formData.role === 'assessor' ? 'Assessor' : 'Moderator'} created successfully` });
                setShowCreateModal(false);
                setFormData({ name: '', email: '', password: '', role: 'assessor' });
                loadUsers();
            } else {
                toast({ title: 'Error', description: data.error || 'Failed to create user', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Create user error:', error);
            toast({ title: 'Error', description: 'Network error', variant: 'destructive' });
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            return;
        }

        setDeleting(userId);

        try {
            const response = await fetch(`${api.baseUrl}/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast({ title: 'Deleted', description: `${userName} has been removed` });
                loadUsers();
            } else {
                const data = await response.json();
                toast({ title: 'Error', description: data.error || 'Failed to delete user', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Delete user error:', error);
            toast({ title: 'Error', description: 'Network error', variant: 'destructive' });
        } finally {
            setDeleting(null);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-purple-500 text-white"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
            case 'assessor':
                return <Badge className="bg-blue-500 text-white"><UserCheck className="w-3 h-3 mr-1" />Assessor</Badge>;
            case 'moderator':
                return <Badge className="bg-green-500 text-white"><Users className="w-3 h-3 mr-1" />Moderator</Badge>;
            default:
                return <Badge>{role}</Badge>;
        }
    };

    const assessors = users.filter(u => u.role === 'assessor');
    const moderators = users.filter(u => u.role === 'moderator');

    // Get user initials for avatar
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span className="hover:text-gray-700 cursor-pointer">Home</span>
                        <span>/</span>
                        <span className="text-blue-600 font-medium">User Management</span>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                        User Management
                    </h1>
                    <p className="text-gray-500 mt-1">Create and manage assessor & moderator accounts</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-200 h-11 px-6 rounded-xl"
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add User
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Assessors Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Assessors</p>
                                <p className="text-5xl font-bold mt-2">{assessors.length}</p>
                                <p className="text-blue-200 text-sm mt-2">Active accounts</p>
                            </div>
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <UserCheck className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Moderators Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">Moderators</p>
                                <p className="text-5xl font-bold mt-2">{moderators.length}</p>
                                <p className="text-emerald-200 text-sm mt-2">Active accounts</p>
                            </div>
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <Users className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Users Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-violet-200">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-violet-100 text-sm font-medium uppercase tracking-wide">Total Users</p>
                                <p className="text-5xl font-bold mt-2">{users.length}</p>
                                <p className="text-violet-200 text-sm mt-2">All accounts</p>
                            </div>
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <Shield className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Lists */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="text-gray-500 mt-4">Loading users...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Assessors Panel */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <UserCheck className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Assessors</h3>
                                        <p className="text-sm text-gray-500">{assessors.length} accounts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {assessors.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                        <UserCheck className="w-10 h-10 text-blue-300" />
                                    </div>
                                    <h4 className="text-gray-700 font-medium mb-1">No assessors yet</h4>
                                    <p className="text-gray-400 text-sm max-w-[200px]">Create your first assessor account to get started</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4 text-blue-600 border-blue-200 hover:bg-blue-50"
                                        onClick={() => { setFormData({ ...formData, role: 'assessor' }); setShowCreateModal(true); }}
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add Assessor
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {assessors.map((u) => (
                                        <div key={u.id} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                                    {getInitials(u.name)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{u.name}</p>
                                                    <p className="text-sm text-gray-500">{u.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-medium">Active</Badge>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                                    disabled={deleting === u.id}
                                                >
                                                    {deleting === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Moderators Panel */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <Users className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Moderators</h3>
                                        <p className="text-sm text-gray-500">{moderators.length} accounts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {moderators.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                        <Users className="w-10 h-10 text-emerald-300" />
                                    </div>
                                    <h4 className="text-gray-700 font-medium mb-1">No moderators yet</h4>
                                    <p className="text-gray-400 text-sm max-w-[200px]">Create your first moderator account to get started</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                        onClick={() => { setFormData({ ...formData, role: 'moderator' }); setShowCreateModal(true); }}
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add Moderator
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {moderators.map((u) => (
                                        <div key={u.id} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                                    {getInitials(u.name)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{u.name}</p>
                                                    <p className="text-sm text-gray-500">{u.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-medium">Active</Badge>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                                    disabled={deleting === u.id}
                                                >
                                                    {deleting === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create User Modal - Modern Design */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5">
                        <DialogTitle className="text-xl font-semibold text-white flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <UserPlus className="w-5 h-5 text-white" />
                            </div>
                            Create New User
                        </DialogTitle>
                        <p className="text-blue-100 text-sm mt-1">Add a new assessor or moderator account</p>
                    </div>

                    <div className="px-6 py-6 space-y-6">
                        {/* Role Selection - Pill Style */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">Select Role *</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'assessor' })}
                                    className={`relative flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 ${formData.role === 'assessor'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <UserCheck className={`w-5 h-5 ${formData.role === 'assessor' ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className="font-medium">Assessor</span>
                                    {formData.role === 'assessor' && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'moderator' })}
                                    className={`relative flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 ${formData.role === 'moderator'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <Users className={`w-5 h-5 ${formData.role === 'moderator' ? 'text-emerald-600' : 'text-gray-400'}`} />
                                    <span className="font-medium">Moderator</span>
                                    {formData.role === 'moderator' && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Full Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                                className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter email address"
                                className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Minimum 6 characters"
                                    className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.password && formData.password.length < 6 && formData.password.length > 0 && (
                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                    Password must be at least 6 characters
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setShowCreateModal(false)}
                            className="px-5 h-11 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateUser}
                            disabled={creating || !formData.name || !formData.email || formData.password.length < 6}
                            className={`px-6 h-11 rounded-xl font-medium shadow-lg transition-all duration-200 ${formData.role === 'assessor'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
                        >
                            {creating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Create {formData.role === 'assessor' ? 'Assessor' : 'Moderator'}
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagement;
