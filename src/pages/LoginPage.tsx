import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import NeonBackground from '@/components/NeonBackground';
import FuturisticLoader from '@/components/FuturisticLoader';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithCredentials, user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            redirectByRole(user.role);
        }
    }, [user]);

    const redirectByRole = (role: string) => {
        switch (role) {
            case 'admin':
                navigate('/admin-dashboard');
                break;
            case 'assessor':
                navigate('/assessor-dashboard');
                break;
            case 'moderator':
                navigate('/moderator-dashboard');
                break;
            default:
                navigate('/');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await loginWithCredentials(email, password);

            if (!result.success) {
                setError(result.error || 'Login failed');
                setIsLoading(false);
                return;
            }

            // Will redirect via useEffect when user state updates
        } catch (err) {
            setError('An unexpected error occurred');
            setIsLoading(false);
        }
    };

    // Show futuristic loader during login
    if (isLoading) {
        return <FuturisticLoader type="login" />;
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
            {/* Three.js Neon Background */}
            <NeonBackground />

            {/* CSS Styles */}
            <style>{`
                @keyframes textGlow {
                    0%, 100% { 
                        text-shadow: 0 0 20px rgba(255,255,255,0.1), 0 0 40px rgba(255,255,255,0.05);
                        opacity: 0.08;
                    }
                    50% { 
                        text-shadow: 0 0 30px rgba(255,255,255,0.15), 0 0 60px rgba(255,255,255,0.08);
                        opacity: 0.12;
                    }
                }
                .watermark-text {
                    position: absolute;
                    font-size: clamp(100px, 18vw, 280px);
                    font-weight: 900;
                    color: white;
                    opacity: 0.08;
                    pointer-events: none;
                    user-select: none;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    white-space: nowrap;
                    animation: textGlow 4s ease-in-out infinite;
                    z-index: 1;
                }
                .watermark-top {
                    top: 8%;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .watermark-bottom {
                    bottom: 8%;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: clamp(60px, 10vw, 150px);
                    opacity: 0.06;
                    animation-delay: 2s;
                }
                .login-card {
                    backdrop-filter: blur(20px);
                    background: rgba(15, 15, 30, 0.85);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 
                        0 25px 50px -12px rgba(0, 0, 0, 0.5),
                        0 0 80px rgba(139, 92, 246, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                }
                .neon-input {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.15) !important;
                    color: white !important;
                }
                .neon-input::placeholder {
                    color: rgba(255, 255, 255, 0.4) !important;
                }
                .neon-input:focus {
                    border-color: rgba(139, 92, 246, 0.5) !important;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.2) !important;
                }
                .neon-button {
                    background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #ec4899 100%) !important;
                    background-size: 200% 200% !important;
                    animation: gradientMove 3s ease infinite !important;
                    box-shadow: 0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(6, 182, 212, 0.2) !important;
                }
                .neon-button:hover {
                    box-shadow: 0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(6, 182, 212, 0.3) !important;
                }
                @keyframes gradientMove {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>

            {/* Transparent Bold Text Watermarks */}
            <div className="watermark-text watermark-top">LOGIN</div>
            <div className="watermark-text watermark-bottom">SECURE ACCESS</div>

            {/* Login Card */}
            <Card className="login-card w-full max-w-md relative z-10 border-0 rounded-2xl overflow-hidden mx-4">
                <div className="p-8">
                    {/* Logo and Title */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 via-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl mb-5 transform hover:scale-105 transition-transform duration-300 p-3"
                            style={{ boxShadow: '0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(6, 182, 212, 0.3)' }}>
                            <img
                                src="/images/logo.png"
                                alt="Shield Skills Institute Logo"
                                className="w-full h-full object-contain drop-shadow-lg"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Shield Skills Institute
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">Sign in to your account</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                                className="neon-input h-12 text-base rounded-xl transition-all"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                    className="neon-input h-12 text-base pr-12 rounded-xl transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="neon-button w-full h-12 text-base font-semibold text-white rounded-xl border-0 transition-all duration-300"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Contact your administrator for account access
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
