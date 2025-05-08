'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const router = useRouter();
    const [form, setForm] = useState({ fullname: '', mobile_number: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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

    return (
        <div className="min-h-screen flex items-center justify-center  p-2 font-mono">
            <div className="w-full max-w-md bg-white border-4 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5">
                {/* Logo/App Name */}
                <div className="flex justify-center mb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-black uppercase">
                        <span className="bg-pink-400 px-2 py-1 rotate-1 inline-block">Coupon</span>
                        <span className="bg-cyan-400 px-2 py-1 -rotate-1 inline-block ml-1">Stall</span>
                    </h1>
                </div>

                <h2 className="text-xl font-bold text-black mb-3 text-center uppercase">Sign Up</h2>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 p-2 mb-3 text-red-600 text-sm font-medium">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border-2 border-green-500 p-2 mb-3 text-green-600 text-sm font-medium">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="fullname" className="block text-xs font-bold text-black uppercase mb-1">
                                Full Name
                            </label>
                            <input
                                id="fullname"
                                name="fullname"
                                type="text"
                                required
                                value={form.fullname}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border-2 border-black rounded-none bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="mobile_number" className="block text-xs font-bold text-black uppercase mb-1">
                                Mobile Number
                            </label>
                            <input
                                id="mobile_number"
                                name="mobile_number"
                                type="text"
                                required
                                value={form.mobile_number}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border-2 border-black rounded-none bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-black uppercase mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border-2 border-black rounded-none bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-black uppercase mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border-2 border-black rounded-none bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm" className="block text-xs font-bold text-black uppercase mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirm"
                                name="confirm"
                                type="password"
                                required
                                value={form.confirm}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border-2 border-black rounded-none bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 px-3 border-3 border-black rounded-none 
                            font-bold text-lg uppercase tracking-wider
                            bg-green-400 hover:bg-green-500 
                            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                            active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                            transition-all transform hover:-translate-y-0.5 active:translate-y-0.5
                            disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Loading...' : 'Sign Up'}
                        </button>

                        <a
                            href="/auth/signin"
                            className="flex-1 py-2 px-3 border-3 border-black rounded-none 
                            font-bold text-lg uppercase tracking-wider text-center
                            bg-blue-400 hover:bg-blue-500
                            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                            active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                            transition-all transform hover:-translate-y-0.5 active:translate-y-0.5"
                        >
                            Sign In
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
} 