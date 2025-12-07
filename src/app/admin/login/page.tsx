'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { CreativeNavBar } from '@/components/CreativeNavBar';
import CreativeFooter from '@/components/CreativeFooter';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if it's the admin email
      if (userCredential.user.email === 'admin@gmail.com') {
        // Redirect to admin dashboard
        router.push('/admin/dashboard');
      } else {
        // Not an admin
        setError('You do not have admin privileges');
        await auth.signOut();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CreativeNavBar />
      
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Quick Login Section */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 text-center mb-3">
              🚀 Quick Login for Testing:
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-4 mb-3">
              <div className="flex items-start gap-2 mb-2">
                <div className="text-2xl">👤</div>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Demo Admin Account</p>
                  <p className="text-xs text-blue-700 font-mono">
                    Email: admin@gmail.com<br />
                    Password: admin123
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-blue-600 bg-blue-100 rounded p-2">
                💡 <strong>First time?</strong> Create this user in Firebase Console first:<br />
                <a 
                  href="https://console.firebase.google.com/project/action-plan-3w-tracker/authentication/users" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800"
                >
                  Firebase Console → Add User
                </a>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full border-2 border-purple-300 hover:bg-purple-50"
              onClick={() => {
                setEmail('admin@gmail.com');
                setPassword('admin123');
              }}
            >
              ✨ Fill Demo Credentials
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
      
      <CreativeFooter />
    </div>
  );
}
