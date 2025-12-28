import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Users } from 'lucide-react';

const RoleToggle: React.FC = () => {
  const { userRole, setUserRole, isAdmin } = useAuth();

  return (
    <div className="flex items-center gap-3 p-4 bg-card border rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        {isAdmin ? <UserCheck className="h-4 w-4" /> : <Users className="h-4 w-4" />}
        <span className="text-sm font-medium">Current Role:</span>
        <Badge variant={isAdmin ? "destructive" : "secondary"}>
          {isAdmin ? 'Admin' : 'User'}
        </Badge>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setUserRole(userRole === 'admin' ? 'user' : 'admin')}
      >
        Switch to {userRole === 'admin' ? 'User' : 'Admin'}
      </Button>
    </div>
  );
};

export default RoleToggle;