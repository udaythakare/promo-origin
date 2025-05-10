import React from 'react'
import { updateUserPersonalInfo } from '../actions/userActions'
import PersonalInfoForm from './PersonalInfoForm'
import { cookies } from 'next/headers';

export default async function PersonalInfoSection({ userData }) {
    try {
        const response1 = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/user-data`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookies().toString()
            },
        });

        if (!response1.ok) {
            throw new Error('Failed to fetch location data');
        }

        const userData = await response1.json();
        // console.log(userData, '*******************');
        return (
            <div className="max-w-xl mx-auto">
                <PersonalInfoForm
                    initialData={userData.userInfo}
                    onSubmit={updateUserPersonalInfo}
                />
            </div>
        )
    } catch (error) {
        console.error('Error in PersonalInfoSection:', error);
        return (
            <div className="p-4 border-2 border-red-500 bg-red-50 rounded-md">
                <p className="text-red-700">Failed to load user data. Please try again later.</p>
            </div>
        );
    }
}