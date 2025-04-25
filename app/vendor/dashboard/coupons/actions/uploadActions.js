// app/actions/uploadActions.js
'use server'

import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { options } from '@/app/api/auth/[...nextauth]/options';
import cloudinary from '@/lib/cloudinary';

export async function uploadImage(formData) {
    try {
        // Check authentication
        const session = await getServerSession(options);
        if (!session) {
            return { error: "Unauthorized" };
        }

        const file = formData.get('file');
        if (!file) {
            return { error: "No file uploaded" };
        }

        // Convert the file to a buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'coupons',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(buffer);
        });

        return { url: result.secure_url };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { error: "Failed to upload image" };
    }
}