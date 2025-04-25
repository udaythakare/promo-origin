'use client'
import React, { useState } from 'react'
import { getSession, signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { IoMailOutline } from 'react-icons/io5'
import { RiLockPasswordLine } from 'react-icons/ri'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
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
                setError('Login failed. Please check your credentials.')
                setIsLoading(false)
                return
            }

            // Only check role immediately after login
            const session = await getSession()
            if (session?.user) {
                const roles = session.user.roles || []
                if (roles.includes('app_business_owner')) {
                    router.push('/vendor/dashboard')
                } else {
                    router.push('/')
                }
            }
        } catch (err) {
            console.error('Login Submit Error:', err)
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-700">CouponHub</h1>
                    <p className="text-blue-600 mt-1">Your Ultimate Savings Destination</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-blue-600 p-6 text-white text-center">
                        <h2 className="text-2xl font-semibold">Welcome Back</h2>
                        <p className="text-blue-100 mt-1">Sign in to access your account</p>
                    </div>
                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IoMailOutline className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 block w-full rounded-lg border border-gray-300 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <RiLockPasswordLine className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 block w-full rounded-lg border border-gray-300 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? <FiEyeOff className="h-5 w-5 text-gray-400" /> : <FiEye className="h-5 w-5 text-gray-400" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </a>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                        <div className="relative flex items-center mt-6">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">or continue with</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="mt-4 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-2.5 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <FcGoogle className="h-5 w-5" />
                            <span className="font-medium text-gray-700">Sign in with Google</span>
                        </button>
                    </div>
                    <div className="px-6 pb-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Create one now
                            </a>
                        </p>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2025 CouponHub. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

