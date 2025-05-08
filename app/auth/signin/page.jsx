'use client'
import React, { useState } from 'react'
import { getSession, signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { IoMailOutline } from 'react-icons/io5'
import { RiLockPasswordLine } from 'react-icons/ri'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
    const userType = 'user'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
                userType
            })
            if (result?.error) {
                setError(result.error)
                setIsLoading(false)
                return
            }
            if (!result?.ok) {
                setError('Sign in failed. Please check your credentials.')
                setIsLoading(false)
                return
            }

            // Only check role immediately after login
            const session = await getSession()
            if (session?.user) {
                const roles = session.user.roles || []
                if (roles.includes('app_business_owner')) {
                    router.push('/business/dashboard')
                } else {
                    router.push('/')
                }
            }
        } catch (err) {
            console.error('Sign In Submit Error:', err)
            setError('An unexpected error occurred. Please try again.')
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            const result = await signIn('google', {
                callbackUrl: 'http://localhost:3000/',
                redirect: false,
            });

            if (result?.error) {
                console.log(result?.error)
                setError(result.error);
            } else if (result?.url) {
                router.push(result.url);
            }
        } catch (error) {
            setError('An error occurred during Google sign-in');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">CouponStall</h1>
                    <p className="text-xl font-bold text-gray-800">Your Ultimate Savings Destination</p>
                </div>
                
                <div className="transform mb-6">
                    <div className="bg-yellow-400 border-4 border-black rounded-none p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0)] transition-all duration-200">
                        <h2 className="font-bold text-2xl uppercase text-center">SIGN IN</h2>
                        <p className="font-medium mb-4 text-center">Access your savings account</p>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-500 border-2 border-black text-white font-bold rounded-none text-sm transform -rotate-1">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IoMailOutline className="h-5 w-5 text-black" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 block w-full rounded-none border-4 border-black py-3 text-black bg-white placeholder-gray-500 font-medium focus:ring-0 focus:outline-none"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <RiLockPasswordLine className="h-5 w-5 text-black" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 block w-full rounded-none border-4 border-black py-3 text-black bg-white placeholder-gray-500 font-medium focus:ring-0 focus:outline-none"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? <FiEyeOff className="h-5 w-5 text-black" /> : <FiEye className="h-5 w-5 text-black" />}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <a href="#" className="text-sm font-bold text-black underline hover:no-underline transform hover:-translate-y-1 transition-transform duration-200">
                                    Forgot your password?
                                </a>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white font-bold py-4 px-6 border-4 border-black rounded-none transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0)] disabled:opacity-70 uppercase"
                            >
                                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                            </button>
                        </form>
                        
                        <div className="relative flex items-center mt-6">
                            <div className="flex-grow border-t-4 border-black"></div>
                            <span className="flex-shrink mx-4 text-black font-bold">OR</span>
                            <div className="flex-grow border-t-4 border-black"></div>
                        </div>
                        
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="mt-4 w-full bg-white hover:bg-gray-100 text-black font-bold py-4 px-2 border-4 border-black rounded-none transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0)]"
                        >
                            <div className="flex items-center justify-center">
                                <FcGoogle className="w-6 h-6 mr-3" />
                                <span>Continue with Google</span>
                            </div>
                        </button>
                    </div>
                </div>
                
                <div className="text-center">
                    <div className="font-bold uppercase inline-block bg-blue-200 px-4 py-2 transform -rotate-2 border-2 border-black">
                        Don't have an account?{' '}
                        <a href="/auth/signup" className="underline hover:no-underline">
                            Create one now
                        </a>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="font-bold uppercase inline-block bg-blue-400 px-4 py-2 transform rotate-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                        SAVE BIG TODAY!
                    </p>
                </div>
                
                <div className="mt-8 text-center text-sm font-bold">
                    <p>© {new Date().getFullYear()} CouponStall. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
} 