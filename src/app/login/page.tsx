'use client'

import { useEffect, useState } from 'react'
import {
  signInWithRedirect,
  signInWithPopup,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/firebase'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const redirected = localStorage.getItem('redirected')
    if (!loading && user) {
      localStorage.removeItem('redirected')
      router.push('/')
    }
    if (!loading && !user && redirected === 'true') {
      setTimeout(() => {
        if (!auth.currentUser) {
          console.warn('Auth still empty after delay')
          localStorage.removeItem('redirected')
        }
      }, 3000)
    }
  }, [user, loading])

  const isIosSafari = () => {
    const ua = window.navigator.userAgent
    return /iP(ad|od|hone)/i.test(ua) && /WebKit/i.test(ua) && !/CriOS|FxiOS/i.test(ua)
  }

  const handleGoogleLogin = async () => {
    try {
      if (isIosSafari()) {
        localStorage.setItem('redirected', 'true')
        await signInWithRedirect(auth, googleProvider)
      } else {
        await signInWithPopup(auth, googleProvider)
      }
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth)
    } catch (error) {
      console.error('Anonymous login failed:', error)
    }
  }

 // SIGN UP with email
const handleEmailSignup = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date()
    });

    console.log("Signed up with email:", user.email);
  } catch (error: any) {
    console.error("Signup error:", error.message);
  }
};

// LOG IN with email
const handleEmailLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in with email:", userCredential.user.email);
  } catch (error: any) {
    console.error("Login error:", error.message);
    
    if(error.message.includes("credential")){
      setErrorMsg("Password")
    } if(error.message.includes("email")){
      setErrorMsg("Email")
    } 
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900 rounded-xl shadow-lg p-8 text-center space-y-5">
        <h1 className="text-4xl font-bold">Welcome to Quran Memory</h1>
        <p className=' text-xl '>{isSignUp ? 'Create a new account' : 'Sign in with your email or Google'}</p>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Sign in with Google
        </button>

        <div className="text-gray-500 text-sm">or</div>

        <div className="flex flex-col items-center justify-center space-y-3 gap-1">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-center"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-center"
          />
          {errorMsg && 
            <p className="w-full px-2 py-0.5 text-l text-center bg-red-600 text-white">
                Incorrect {errorMsg} 
            </p>}

          {isSignUp && <button
            className="w-fit px-6 py-2 rounded-md text-white text-xl bg-green-700 hover:bg-green-800"
            onClick={() => handleEmailSignup(email, password)}>
            Sign Up
          </button>}
          

          {!isSignUp && <button
            className="w-fit px-6 py-2 rounded-md text-white text-xl bg-green-700 hover:bg-green-800"
            onClick={() => handleEmailLogin(email, password)}>
            Log In
          </button>}

          <p
            className="text-sm text-center text-white hover:underline cursor-pointer"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </p>

        </div>
        

        <button
          onClick={handleAnonymousLogin}
          className="w-fit px-6 py-2 rounded-md bg-amber-700 text-white hover:bg-amber-900"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  )
}
