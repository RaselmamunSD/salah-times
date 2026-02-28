'use client';

import React, { useState } from 'react';
import axios from 'axios';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                throw new Error('API URL not configured');
            }

            const response = await axios.post(
                `${apiUrl}/api/newsletter/subscribe/`,
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000,
                }
            );

            if (response.status === 201 || response.status === 200) {
                setMessage('✓ Successfully subscribed to our newsletter!');
                setEmail('');
                setTimeout(() => setMessage(''), 5000);
            }
        } catch (err) {
            console.error('Newsletter error:', err);
            let errorMsg = 'Failed to subscribe. Please try again.';
            
            if (err.response) {
                if (err.response.data?.email?.[0]) {
                    errorMsg = err.response.data.email[0];
                } else if (err.response.data?.message) {
                    errorMsg = err.response.data.message;
                } else if (err.response.data?.error) {
                    errorMsg = err.response.data.error;
                } else if (err.response.status === 400) {
                    errorMsg = 'Invalid email address';
                } else if (err.response.status === 500) {
                    errorMsg = 'Server error';
                }
            } else if (err.request) {
                errorMsg = 'Cannot connect to server';
            } else if (err.message) {
                errorMsg = err.message;
            }
            
            setError(errorMsg);
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full py-16 md:py-24 px-4 md:px-0 bg-linear-to-r from-[#1F8A5B]/5 to-[#1F6F8B]/5">
            <div className="max-w-[600px] mx-auto text-center">
                {/* Heading */}
                <h2 className="font-semibold text-[30px] md:text-[40px] text-[#1E293B] mb-4">
                    Stay Updated
                </h2>

                {/* Subheading */}
                <p className="text-[16px] md:text-[18px] text-[#64748B] mb-8">
                    Subscribe for prayer time updates and important announcements
                </p>

                {/* Form */}
                <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="flex-1 px-4 py-3 md:py-4 rounded-[10px] border border-[#E2E8F0] focus:outline-none focus:border-[#1F8A5B] focus:ring-2 focus:ring-[#1F8A5B]/20 text-[14px] md:text-[16px]"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-[#1F8A5B] to-[#1F6F8B] text-white font-semibold rounded-[10px] hover:shadow-lg transition-all duration-300 disabled:opacity-70 cursor-pointer text-[14px] md:text-[16px]"
                    >
                        {loading ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <p className="mt-4 text-[#10B981] font-medium text-[14px] md:text-[16px]">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="mt-4 text-[#EF4444] font-medium text-[14px] md:text-[16px]">
                        {error}
                    </p>
                )}

                {/* Privacy Note */}
                <p className="text-[12px] md:text-[14px] text-[#94A3B8] mt-6">
                    We respect your privacy. Unsubscribe anytime.
                </p>
            </div>
        </section>
    );
};

export default Newsletter;
