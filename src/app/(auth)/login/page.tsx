'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import type { Role } from '@/types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider, setAuthPersistence } from '@/lib/firebase';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().default(false),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.01,35.638,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('Analyst');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser, setRole } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      await setAuthPersistence(values.rememberMe);
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const authUser = userCredential.user;
      const appUser = {
        uid: authUser.uid,
        name: authUser.displayName || 'User',
        email: authUser.email || '',
        avatarUrl: authUser.photoURL || `https://i.pravatar.cc/150?u=${authUser.uid}`,
        role: selectedRole,
      };
      setUser(appUser);
      setRole(selectedRole);
      localStorage.setItem('medi-secure-x2-user', JSON.stringify(appUser));
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await setAuthPersistence(form.getValues('rememberMe'));
      const userCredential = await signInWithPopup(auth, googleProvider);
      const authUser = userCredential.user;
       const appUser = {
        uid: authUser.uid,
        name: authUser.displayName || 'User',
        email: authUser.email || '',
        avatarUrl: authUser.photoURL || `https://i.pravatar.cc/150?u=${authUser.uid}`,
        role: selectedRole,
      };
      setUser(appUser);
      setRole(selectedRole);
      localStorage.setItem('medi-secure-x2-user', JSON.stringify(appUser));
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Google Login Failed", description: error.message });
    }
  };

  const handlePasswordReset = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast({ variant: "destructive", title: "Password Reset", description: "Please enter your email address first." });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Password Reset", description: "Password reset email sent. Please check your inbox." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-headline">MediSecureX2</CardTitle>
          <CardDescription>Sign in to access your security dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Keep me logged in</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="button" variant="link" className="p-0 h-auto" onClick={handlePasswordReset}>
                  Forgot Password?
                </Button>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="font-semibold">Select Your Role (for demo)</Label>
                <RadioGroup defaultValue="Analyst" value={selectedRole} onValueChange={(value: string) => setSelectedRole(value as Role)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Viewer" id="r1" />
                        <Label htmlFor="r1">Viewer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Analyst" id="r2" />
                        <Label htmlFor="r2">Analyst</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Admin" id="r3" />
                        <Label htmlFor="r3">Admin</Label>
                    </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full h-12 text-lg">
                Login
              </Button>
            </form>
          </Form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" onClick={handleGoogleLogin} className="w-full h-12 text-lg">
            <GoogleIcon className="h-6 w-6 mr-2" />
            Login with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
              Sign Up
            </Link>
          </p>

        </CardContent>
      </Card>
    </main>
  );
}
