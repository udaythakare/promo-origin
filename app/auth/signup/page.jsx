'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoMailOutline, IoPersonOutline, IoPhonePortraitOutline } from 'react-icons/io5';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function SignUpPage() {
    const router = useRouter();
    const [form, setForm] = useState({ fullname: '', mobile_number: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Validate passwords match
        if (form.password !== form.confirm) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Step 1: Register the user
            const regRes = await fetch('/api/register-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullname: form.fullname,
                    mobile_number: form.mobile_number,
                    email: form.email,
                    password: form.password,
                }),
            });

            const regData = await regRes.json();

            if (regData.success) {
                setSuccessMessage('Registration successful! Please check your email to verify your account.');
                // Clear form
                setForm({ fullname: '', mobile_number: '', email: '', password: '', confirm: '' });

                // Redirect to signin after 5 seconds
                setTimeout(() => {
                    router.push('/auth/signin');
                }, 5000);
            } else {
                setError(regData.message || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };


    const handleGoogleSignUp = async () => {
            try {
                const result = await signIn('google', {
                    // callbackUrl: 'http://localhost:3000/',
                    callbackUrl: process.env.NEXT_PUBLIC_SITE_URL,
                    redirect: false,
                });
    
                if (result?.error) {
                    // // console.log(result?.error)
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
            <div className="w-full max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">LocalGrow</h1>
                    <p className="text-xl font-bold text-gray-800">Your Ultimate Savings Destination</p>
                </div>

                <div className="transform mb-6">
                    <div className="bg-green-400 border-4 border-black rounded-none p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0)] transition-all duration-200">
                        <h2 className="font-bold text-2xl uppercase text-center mb-2">CREATE ACCOUNT</h2>
                        <p className="font-medium mb-6 text-center">Join the savings revolution!</p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500 border-2 border-black text-white font-bold rounded-none text-sm transform -rotate-1">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IoPersonOutline className="h-5 w-5 text-black" />
                                        </div>
                                        <input
                                            id="fullname"
                                            name="fullname"
                                            type="text"
                                            required
                                            value={form.fullname}
                                            onChange={handleChange}
                                            className="pl-10 block w-full rounded-none border-4 border-black py-3 text-black bg-white placeholder-gray-500 font-medium focus:ring-0 focus:outline-none"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IoPhonePortraitOutline className="h-5 w-5 text-black" />
                                        </div>
                                        <input
                                            id="mobile_number"
                                            name="mobile_number"
                                            type="tel"
                                            required
                                            value={form.mobile_number}
                                            onChange={handleChange}
                                            className="pl-10 block w-full rounded-none border-4 border-black py-3 text-black bg-white placeholder-gray-500 font-medium focus:ring-0 focus:outline-none"
                                            placeholder="Mobile Number"
                                        />
                                    </div>
                                </div>
                            </div>

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
                                        value={form.email}
                                        onChange={handleChange}
                                        className="pl-10 block w-full rounded-none border-4 border-black py-3 text-black bg-white placeholder-gray-500 font-medium focus:ring-0 focus:outline-none"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            value={form.password}
                                            onChange={handleChange}
                                            className="pl-10 pr-10 block w-full rounded-none border-4 border-black py-3 text-black bg-white placeholder-gray-500 font-medium focus:ring-0 focus:outline-none"
                                            placeholder="Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? <FiEyeOff className="h-5 w-5 text-black" /> : <FiEye className="h-5 w-5 text-black" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <RiLockPasswordLine className="h-5 w-5 text-black" />
                                        </div>
                                        <input
                                            id="confirm"
                                            name="confirm"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            value={form.confirm}
                                            onChange={handleChange}
                                            className="pl-10 pr-10 block w-full rounded-none border-4 border-black py-3 text-black bg-white placeholder-gray-500 font-medium focus:ring-0 focus:outline-none"
                                            placeholder="Confirm Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showConfirmPassword ? <FiEyeOff className="h-5 w-5 text-black" /> : <FiEye className="h-5 w-5 text-black" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                onClick={handleSubmit}
                                className="w-full bg-black text-white font-bold py-4 px-6 border-4 border-black rounded-none transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0)] disabled:opacity-70 uppercase"
                            >
                                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                            </button>
                        </div>

                        <div className="relative flex items-center mt-6">
                            <div className="flex-grow border-t-4 border-black"></div>
                            <span className="flex-shrink mx-4 text-black font-bold">OR</span>
                            <div className="flex-grow border-t-4 border-black"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            className="mt-4 w-full bg-white hover:bg-gray-100 text-black font-bold py-4 px-2 border-4 border-black rounded-none transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0)]"
                        >
                            <div className="flex items-center justify-center">
                                <FcGoogle className="w-6 h-6 mr-3" />
                                <span>Sign up with Google</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="text-center">
                    <div className="font-bold uppercase inline-block bg-pink-200 px-4 py-2 transform rotate-2 border-2 border-black">
                        Already have an account?{' '}
                        <a href="/auth/signin" className="underline hover:no-underline">
                            Sign in here
                        </a>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="font-bold uppercase inline-block bg-orange-400 px-4 py-2 transform -rotate-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                        START SAVING NOW!
                    </p>
                </div>

                <div className="mt-8 text-center text-sm font-bold">
                    <p>© {new Date().getFullYear()} LocalGrow. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
} 