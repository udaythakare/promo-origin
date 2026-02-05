import React from 'react'
import { cookies } from 'next/headers'
import { updateUserPersonalInfo } from '../apply-for-investor/actions/userActions'
import PersonalInfoForm from './PersonalInfoForm'

// Use Next.js 14 data caching with fetch
export async function fetchUserData() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/user-data`,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: (await cookies()).toString()
                },
                // Configure caching directly in fetch options
                cache: 'force-cache', // Enables caching
                next: {
                    revalidate: 3600 // Revalidate every hour
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export default async function PersonalInfoSection() {
    // Fetch user data from the cached function
    const userData = await fetchUserData();

    // Handle case where user data couldn't be fetched
    if (!userData) {
        return (
            <div className="p-4 border-2 border-red-500 bg-red-50 rounded-md">
                <p className="text-red-700">Failed to load user data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <PersonalInfoForm
                initialData={userData.userInfo}
                onSubmit={updateUserPersonalInfo}
            />
        </div>
    );
}

// Server Action to revalidate user data after update
export async function revalidateUserData() {
    'use server'

    // This will clear the cache for getUserData
    // Forcing a fresh fetch on next request
    revalidatePath('/u/profile')
}