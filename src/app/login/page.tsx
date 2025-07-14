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

  // const handleAnonymousLogin = async () => {
  //   try {
  //     const userCredential = await signInAnonymously(auth);
  //     const user = userCredential.user;
  
  //     // Save anonymous data to default document
  //     const defaultUserId = "user_123";
  //     await setDoc(doc(db, "users", defaultUserId), {
  //       isAnonymous: true,
  //       uid: user.uid, // Track actual Firebase UID for debugging
  //       createdAt: new Date()
  //     });
  
  //     console.log("Anonymous user logged in and saved as user_123");
  //   } catch (error: any) {
  //     console.error("Anonymous login error:", error.message);
  //   }
  // };
  

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
    
    await setDoc(doc(db, "memorizeTable", user.uid), {
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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-white to-black px-4">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-800">🌿 Quran Memory</h1>
        <p className="text-gray-600 text-lg font-medium">
          {isSignUp ? 'Start your memorisation journey' : 'Welcome back — continue learning'}
        </p>
        <p className="text-xs text-gray-500 italic mt-1">
          "And We have certainly made the Qur'an easy for remembrance..." (54:17)
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition duration-200"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="h-5 w-5"
        />
        Sign in with Google
      </button>

      <div className="relative text-center text-sm text-gray-400">
        <span className="px-2 bg-white">or continue with email</span>
        <div className="absolute left-0 top-1/2 w-full border-t border-gray-200 z-0"></div>
      </div>

      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />

        {errorMsg && (
          <p className="text-center text-red-600 text-sm bg-red-100 py-1 rounded-md">
            Incorrect {errorMsg}
          </p>
        )}

        <button
          className="w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition duration-200"
          onClick={() =>
            isSignUp
              ? handleEmailSignup(email, password)
              : handleEmailLogin(email, password)
          }
        >
          {isSignUp ? 'Create Account' : 'Log In'}
        </button>

        <p
          className="text-sm text-center text-blue-600 hover:underline cursor-pointer"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
        </p>
      </div>
    </div>
  </div>
)

}
