"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield } from "lucide-react"
import { useSetAtom } from "jotai"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { loginAtom } from "@/lib/jotai/auth-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToken, useLoginWithEmail} from '@privy-io/react-auth';
//import cookies from 'js-cookie';

export interface SignInFormState {
  data: {
    email: string;
    code: string;
  };
  error?: string;
}

const initialState: SignInFormState = {
  data: {
    email: '',
    code: '',
  },
};

export default function LoginPage() {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const [isCodeSent, setIsCodeSent] = useState(false);
  const login = useSetAtom(loginAtom); // this gives you a callable login function

  const { getAccessToken } = useToken();
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
                  description: `Welcome back, ${user.name}!`, // Use `user`, not `authState.user` here
                });
                const redirectPath = sessionStorage.getItem("redirectAfterLogin")
                router.push("/dashboard")
              },
              onError: (err) => {
                console.log(err);
                toast({
                  title: "Login failed",
                  description: err?.message || "Please try again.",
                });
                if(err.status===401){
                  setError("Please register fisrt.");
                }
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

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
          <CardTitle className="text-2xl font-bold">CSDS</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                  id="email" name="email" type="email" placeholder="name@example.com" 
                  required 
                  defaultValue={state.data.email}
                  onChange={event =>
                    setState({
                      ...state,
                      data: { ...state.data, email: event.target.value },
                      error: undefined,
                    })
                  }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="code">Code</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
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

            {/* <div className="text-sm text-muted-foreground">
              <p>Demo accounts:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>admin@cybershield.com / admin123</li>
                <li>analyst@cybershield.com / analyst123</li>
                <li>user@cybershield.com / user123</li>
              </ul>
            </div> */}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className='w-full'
              onClick={() => {
                sendCode({ email: state.data.email });
                setIsCodeSent(true);
                setError(null);
              }}
              >
              Send Code
            </Button>
            {state.data.email.trim() !== '' && isCodeSent && (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            )}
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
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
