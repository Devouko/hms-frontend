'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';


interface AuthPageProps {
  supabase: any;
}

export function AuthPage({ supabase }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      const msg = error?.message || '';
      if (msg === 'Failed to fetch') {
        setError('Cannot reach authentication server. Check your internet connection or Supabase project status.');
      } else {
        setError(msg || 'Failed to login');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: 'user' } }
      });

      if (error) throw error;

      if (data.user) {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) {
          setError('Account created! Please check your email to verify your account.');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-card">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-4 sm:mb-6"
            >
              <Activity className="size-6 sm:size-8 text-primary" />
              <span className="text-xl sm:text-2xl font-bold text-foreground">SmartCare</span>
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {isLogin ? 'Welcome back' : 'Create Account'}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isLogin ? 'Sign in to access your dashboard' : 'Sign up to get started'}
            </p>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4 sm:space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-destructive/10 border border-destructive/30 text-destructive px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-10 sm:h-12 bg-black hover:bg-black/90 text-card-foreground text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Sign up'}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right side - Image */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden lg:block lg:w-1/2 relative min-h-[300px] lg:min-h-0"
      >
        <Image 
          src="/login.png" 
          alt="Hospital Management" 
          fill
          className="object-cover"
          priority
        />
      </motion.div>
    </div>
  );
}

