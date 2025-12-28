import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo credentials
    const validEmail = 'erishhhh@demo.com';
    const validPassword = 'admin@11';

    setTimeout(() => {
      if (email === validEmail && password === validPassword) {
        toast({
          title: "Login successful",
          description: "Welcome to the Admin Dashboard",
        });
        onLogin();
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header outside the card */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div>
            <div className="flex items-center justify-center mb-2">
              <div className="bg-red-500 text-white px-4 py-2 text-xl font-bold mr-3 shadow-lg h-16 flex items-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)', transform: 'perspective(500px) rotateX(10deg)' }}>SSIPL</div>
              <div className="text-5xl font-bold" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.4)', transform: 'perspective(500px) rotateX(5deg)' }}>Shield Skills Institute</div>
            </div>
            <div className="text-lg text-muted-foreground">Training Academy LLP</div>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md h-96 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-2">Access the admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 border border-input"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 border border-input"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            <Lock className="h-4 w-4 mr-2" />
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Card>

      {/* Demo Credentials outside the main card */}
      <div className="mt-6 p-4 bg-muted rounded-lg max-w-md">
        <h4 className="font-semibold text-sm mb-2">Demo Credentials:</h4>
        <div className="text-xs text-muted-foreground space-y-1">
          <div><span className="font-medium">Email:</span> erishhhh@demo.com</div>
          <div><span className="font-medium">Password:</span> admin@11</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;