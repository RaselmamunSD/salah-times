'use client';

import React, { useState } from 'react';
import axios from 'axios';

const NewsletterFooter = () => {
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
                setMessage('✓ Successfully subscribed!');
                setEmail('');
                setTimeout(() => setMessage(''), 3000);
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
        <div>
            <h3 className="text-[#006E3E] font-bold text-xl mb-4">
                Newsletter
            </h3>
            <p className="text-[#333] text-lg mb-6 leading-snug">
                Subscribe for prayer time updates and important announcements
            </p>
            <form onSubmit={handleSubscribe} className="flex border border-[#1F8A5B] rounded-lg overflow-hidden h-12">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="flex-1 px-4 outline-none text-gray-500 italic w-full disabled:bg-gray-100"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#218E5B] text-white px-4 font-medium hover:bg-[#1a7148] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
            {message && (
                <p className="text-[#10B981] font-medium text-sm mt-2">
                    {message}
                </p>
            )}
            {error && (
                <p className="text-[#EF4444] font-medium text-sm mt-2">
                    {error}
                </p>
            )}
        </div>
    );
};

export default NewsletterFooter;
