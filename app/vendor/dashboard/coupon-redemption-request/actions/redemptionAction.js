'use server'
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Fetch all coupon redemption requests (for admin users)
export async function getAllCouponRedemptionRequests() {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    // Check if user has admin role
    const { data: userRoles, error: roleError } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('is_active', true);

    if (roleError) {
        return { error: roleError.message };
    }

    // Check if user is an admin
    // const isAdmin = userRoles.some(role => role.role === 'app_admin');
    // if (!isAdmin) {
    //     return { error: 'Unauthorized. Only admins can view all redemption requests.' };
    // }

    // Fetch all coupon redemption requests with related data
    const { data, error } = await supabaseAdmin
        .from('coupon_requests')
        .select(`
      *,
      users:user_id (id, username, email),
      coupons:coupon_id (
        id, 
        code, 
        title, 
        description, 
        discount_type, 
        discount_value
      ),
      business_locations:business_location_id (
        id,
        address,
        city,
        state,
        businesses:business_id (
          id,
          name
        )
      ),
      user_coupons:user_coupon_id (
        id,
        acquisition_type,
        coins_spent
      )
    `)
        .order('request_timestamp', { ascending: false });

    if (error) {
        return { error: error.message };
    }

    return { data };
}

// Update coupon redemption request status
export async function updateCouponRequestStatus(requestId, newStatus, rejectionReason = null) {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    // Check if user has admin role
    const { data: userRoles, error: roleError } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('is_active', true);

    if (roleError) {
        return { error: roleError.message };
    }

    // // Check if user is an admin
    // const isAdmin = userRoles.some(role => role.role === 'app_admin');
    // if (!isAdmin) {
    //     return { error: 'Unauthorized. Only admins can update redemption requests.' };
    // }

    // Prepare update data based on the new status
    const updateData = {
        status: newStatus
    };

    // Add appropriate timestamp based on the status
    if (newStatus === 'verified') {
        updateData.verification_timestamp = new Date().toISOString();
    } else if (newStatus === 'completed') {
        updateData.completed_timestamp = new Date().toISOString();
    } else if (newStatus === 'rejected') {
        updateData.rejected_timestamp = new Date().toISOString();
        updateData.rejection_reason = rejectionReason;
    }

    // Update the record
    const { data, error } = await supabaseAdmin
        .from('coupon_requests')
        .update(updateData)
        .eq('id', requestId)
        .select();

    if (error) {
        return { error: error.message };
    }

    // Revalidate the page to reflect updated data
    revalidatePath('/admin/coupon-redemptions');
    return { data };
}