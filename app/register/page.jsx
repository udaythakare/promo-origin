'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
            router.push('/login');
        } else {
            setError(data.message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-100 p-4 font-mono">
            <div className="w-full max-w-md bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
                {/* Logo/App Name */}
                <div className="flex justify-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-black uppercase">
                        <span className="bg-pink-400 px-3 py-1 rotate-1 inline-block">Coupon</span>
                        <span className="bg-cyan-400 px-3 py-1 -rotate-1 inline-block ml-1">Stall</span>
                    </h1>
                </div>

                <h2 className="text-2xl font-bold text-black mb-6 text-center uppercase">Register</h2>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 p-3 mb-4 text-red-600 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-bold text-black uppercase mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={form.username}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 border-3 border-black rounded-none bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-black uppercase mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 border-3 border-black rounded-none bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-bold text-black uppercase mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 border-3 border-black rounded-none bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm" className="block text-sm font-bold text-black uppercase mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirm"
                            name="confirm"
                            type="password"
                            required
                            value={form.confirm}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 border-3 border-black rounded-none bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border-4 border-black rounded-none 
                            font-bold text-xl uppercase tracking-wider
                            bg-green-400 hover:bg-green-500 
                            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                            hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                            transition-all transform hover:-translate-y-1 active:translate-y-1
                            disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Loading...' : 'Sign Up'}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="font-medium">
                            Already have an account?{' '}
                            <a
                                href="/login"
                                className="text-blue-600 font-bold relative inline-block
                                after:content-[''] after:absolute after:w-full after:h-1 
                                after:bg-blue-600 after:bottom-0 after:left-0 hover:after:h-2"
                            >
                                Login
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}