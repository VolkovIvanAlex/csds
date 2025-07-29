"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield } from "lucide-react"
import { useSetAtom } from "jotai"
import { loginAtom, registerAtom, UserRole } from "@/lib/jotai/auth-actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToken, useLoginWithEmail} from '@privy-io/react-auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SignUpFormState {
  data: {
    email: string;
    name: string;
    jobTitle: string;
    code: string;
    role: UserRole | ""
  };
  error?: string;
}

const initialState: SignUpFormState = {
  data: {
    email: '',
    name: '',
    jobTitle: '',
    code: '',
    role: '',
  },
};

export default function RegisterPage() {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCodeSent, setIsCodeSent] = useState(false);
  const router = useRouter()
  const { toast } = useToast()
  const { getAccessToken } = useToken();
  const login = useSetAtom(loginAtom);
  const register = useSetAtom(registerAtom);

  const { sendCode, loginWithCode } = useLoginWithEmail({
    onComplete: async () => {
      try {
        const privyAccessToken = await getAccessToken();
        if (privyAccessToken != null) {
          // Attempt to sign in using Privy with the token
          await login({
            privyAccessToken, 
            options: {
              onSuccess: (user) => {
                toast({
                  title: "Login successful",
                  description: `Welcome back, ${user.name}!`,
                });
                router.push("/dashboard")
              },
              onError: async(err) => {
                await register({
                  privyAccessToken, 
                  name: state.data.name,
                  jobTitle: state.data.jobTitle,
                  role: state.data.role as UserRole,
                  options: {
                    onSuccess: (user) => {
                      toast({
                        title: "Register successful",
                        description: `Welcome back, ${user.name}!`,
                      });
                      router.push("/dashboard")
                    },
                    onError: (err) => {
                      toast({
                        title: "Register failed",
                        description: err?.message || "Please try again.",
                      });
                    },
                  },
                });
              },
            },
          });
        } else {
        }
      } catch (err) {
        console.error('Error in onComplete:', err);
      }
    },
    onError: error => {
      console.error('Error during email authentication:', error);
    },
  });

  const validateForm = (): boolean => {
    if (!state.data.email.trim()) {
      setState({ ...state, error: 'Email is required' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.data.email)) {
      setState({ ...state, error: 'Invalid email format' });
      return false;
    }
    if (isCodeSent && !state.data.code.trim()) {
      setState({ ...state, error: 'Verification code is required' });
      return false;
    }
    if (!state.data.name.trim()) {
      setState({ ...state, error: 'Name is required' });
      return false;
    }
    if (!state.data.jobTitle.trim()) {
      setState({ ...state, error: 'Job title is required' });
      return false;
    }
    if (!state.data.role) {
      setState({ ...state, error: 'Please select your role' })
      return false
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return; // Stop if validation fails
    setIsLoading(true)
    setError(null)
    console.log("here");
    try {
      await loginWithCode({ code: state.data.code });
    } catch (error) {
      setError((error as Error).message)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to create your CSDS account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required
                  defaultValue={state.data.name}
                  onChange={event =>
                    setState({
                      ...state,
                      data: { ...state.data, name: event.target.value },
                      error: undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job title</Label>
                <Input id="jobTitle" name="jobTitle" required 
                  defaultValue={state.data.jobTitle}
                  onChange={event =>
                    setState({
                      ...state,
                      data: { ...state.data, jobTitle: event.target.value },
                      error: undefined,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Select
                value={state.data.role}
                onValueChange={(value) =>
                  setState({ ...state, data: { ...state.data, role: value as UserRole }, error: undefined })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.DataProvider}>Data Provider (e.g., Bank, Energy Co.)</SelectItem>
                  <SelectItem value={UserRole.DataConsumer}>Data Consumer (e.g., IT Specialist)</SelectItem>
                  <SelectItem value={UserRole.GovBody}>Government Body</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required 
                defaultValue={state.data.email}
                onChange={event =>
                  setState({
                    ...state,
                    data: { ...state.data, email: event.target.value },
                    error: undefined,
                  })
                }
              />
              <Label htmlFor="code">Code</Label>
              <Input 
                id="code" name="code" type="text" required
                defaultValue={state.data.code}
                placeholder='Verification Code'
                onChange={event =>
                  setState({
                    ...state,
                    data: { ...state.data, code: event.target.value },
                    error: undefined,
                  })
                }
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className='w-full'
              onClick={() => {
                sendCode({ email: state.data.email });
                setIsCodeSent(true);
              }}
              >
              Send Code
            </Button>
            {state.data.email.trim() !== '' && isCodeSent && (
              <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
              </Button>
            )}
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
            <div className="text-center text-sm">
              <Link href="/public-dashboard" className="text-primary hover:underline">
                View public dashboard
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
