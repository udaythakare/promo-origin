// app/coupons/actions/couponActions.ts
'use server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { getUserId } from '@/helpers/userHelper';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fetch businesses owned by the current user
export async function getUserBusinesses() {
    const session = await getServerSession(options);

    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        const { data: businesses, error } = await supabase
            .from('businesses')
            .select('id, name')
            .eq('user_id', session.user.id);

        if (error) throw error;

        return { businesses };
    } catch (error) {
        console.error('Error fetching user businesses:', error);
        return { error: 'Failed to fetch businesses' };
    }
}

// Create a new coupon
export async function createCoupon(formData) {
    console.log('reached here')
    const session = await getServerSession(options);

    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        // First verify that the user owns this business
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('id', formData.business_id)
            .eq('user_id', session.user.id)
            .single();

        if (businessError || !business) {
            return { error: 'Unauthorized access to this business' };
        }

        // Create the coupon
        const { data: coupon, error: couponError } = await supabase
            .from('coupons')
            .insert({
                business_id: formData.business_id,
                title: formData.title,
                description: formData.description || null,
                start_date: formData.start_date,
                end_date: formData.end_date,
                is_active: formData.is_active,
                image_url: formData.image_url,
                coupon_type: formData.coupon_type,
                max_claims: formData.max_uses || null,
                user_id: session?.user?.id
            })
            .select('id')
            .single();

        if (couponError) throw couponError;

        // Handle location-specific coupons
        if (!formData.applies_to_all_locations && formData.location_ids?.length > 0) {
            const locationRecords = formData.location_ids.map(locationId => ({
                coupon_id: coupon.id,
                business_location_id: locationId
            }));

            const { error: locationsError } = await supabase
                .from('coupon_locations')
                .insert(locationRecords);

            if (locationsError) throw locationsError;
        }

        // Handle tags if present
        if (formData.tag_ids?.length > 0) {
            const tagRecords = formData.tag_ids.map(tagId => ({
                coupon_id: coupon.id,
                tag_id: tagId
            }));

            const { error: tagsError } = await supabase
                .from('coupon_tag_relations')
                .insert(tagRecords);

            if (tagsError) throw tagsError;
        }

        revalidatePath('/coupons');
        return { success: true, id: coupon.id };
    } catch (error) {
        console.error('Error creating coupon:', error);
        return { error: 'Failed to create coupon' };
    }
}

// Update an existing coupon
export async function updateCoupon(id, formData) {
    const session = await getServerSession(options);

    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        // Verify that the user owns the business that owns this coupon
        const { data: coupon, error: couponError } = await supabase
            .from('coupons')
            .select('id, business_id, businesses!inner(id, user_id)')
            .eq('id', id)
            .eq('businesses.user_id', session.user.id)
            .single();

        if (couponError || !coupon) {
            return { error: 'Unauthorized access to this coupon' };
        }

        // Update the coupon
        const { error: updateError } = await supabase
            .from('coupons')
            .update({
                title: formData.title,
                description: formData.description || null,
                start_date: formData.start_date,
                end_date: formData.end_date,
                is_active: formData.is_active,
                image_url: formData.image_url,
                coupon_type: formData.coupon_type,
                max_claims: formData.max_uses || null,
                user_id: session?.user?.id
            })
            .eq('id', id);

        if (updateError) throw updateError;

        // Handle location-specific coupons
        // First, delete existing locations
        // const { error: deleteLocationsError } = await supabase
        //     .from('coupon_locations')
        //     .delete()
        //     .eq('coupon_id', id);

        // if (deleteLocationsError) throw deleteLocationsError;

        // // Then add new ones if needed
        // if (!formData.applies_to_all_locations && formData.location_ids?.length > 0) {
        //     const locationRecords = formData.location_ids.map(locationId => ({
        //         coupon_id: id,
        //         business_location_id: locationId
        //     }));

        //     const { error: insertLocationsError } = await supabase
        //         .from('coupon_locations')
        //         .insert(locationRecords);

        //     if (insertLocationsError) throw insertLocationsError;
        // }

        // // Handle tags
        // // First, delete existing tags
        // const { error: deleteTagsError } = await supabase
        //     .from('coupon_tag_relations')
        //     .delete()
        //     .eq('coupon_id', id);

        // if (deleteTagsError) throw deleteTagsError;

        // // Then add new ones if needed
        // if (formData.tag_ids?.length > 0) {
        //     const tagRecords = formData.tag_ids.map(tagId => ({
        //         coupon_id: id,
        //         tag_id: tagId
        //     }));

        //     const { error: insertTagsError } = await supabase
        //         .from('coupon_tag_relations')
        //         .insert(tagRecords);

        //     if (insertTagsError) throw insertTagsError;
        // }

        revalidatePath('/coupons');
        return { success: true };
    } catch (error) {
        console.error('Error updating coupon:', error);
        return { error: 'Failed to update coupon' };
    }
}

// Get locations for a business
export async function getBusinessLocations(businessId) {
    const session = await getServerSession(options);

    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        // Verify user has access to this business
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('id', businessId)
            .eq('user_id', session.user.id)
            .single();

        if (businessError || !business) {
            return { error: 'Unauthorized access to this business' };
        }

        const { data: locations, error: locationsError } = await supabase
            .from('business_locations')
            .select('id, address, city, state, postal_code, country, is_primary')
            .eq('business_id', businessId);

        if (locationsError) throw locationsError;

        return { locations };
    } catch (error) {
        console.error('Error fetching business locations:', error);
        return { error: 'Failed to fetch locations' };
    }
}

// Get product categories for a business
// export async function getBusinessCategories(businessId) {
//     const session = await getServerSession(options);

//     if (!session?.user?.id) {
//         return { error: 'Unauthorized' };
//     }

//     try {
//         const { data: categories, error } = await supabase
//             .from('product_categories')
//             .select('id, name')
//             .eq('business_id', businessId)
//             .in('business_id', supabase
//                 .from('businesses')
//                 .select('id')
//                 .eq('user_id', session.user.id)
//             );

//         if (error) throw error;

//         return { categories };
//     } catch (error) {
//         console.error('Error fetching product categories:', error);
//         return { error: 'Failed to fetch categories' };
//     }
// }

// Get product categories for a business
export async function getBusinessCategories(businessId) {
    const session = await getServerSession(options);

    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        // First verify user has access to this business
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('id', businessId)
            .eq('user_id', session.user.id)
            .single();

        if (businessError || !business) {
            return { error: 'Unauthorized access to this business' };
        }

        // Now fetch the categories
        const { data: categories, error } = await supabase
            .from('product_categories')
            .select('id, name')
            .eq('business_id', businessId);

        if (error) throw error;

        return { categories };
    } catch (error) {
        console.error('Error fetching product categories:', error);
        return { error: 'Failed to fetch categories' };
    }
}

// Get products for a business
// export async function getBusinessProducts(businessId) {
//     const session = await getServerSession(options);

//     if (!session?.user?.id) {
//         return { error: 'Unauthorized' };
//     }

//     try {
//         const { data: products, error } = await supabase
//             .from('products')
//             .select('id, name')
//             .eq('business_id', businessId)
//             .in('business_id', supabase
//                 .from('businesses')
//                 .select('id')
//                 .eq('user_id', session.user.id)
//             );

//         if (error) throw error;

//         return { products };
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         return { error: 'Failed to fetch products' };
//     }
// }

// Get products for a business
export async function getBusinessProducts(businessId) {
    const session = await getServerSession(options);

    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        // First verify user has access to this business
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('id', businessId)
            .eq('user_id', session.user.id)
            .single();

        if (businessError || !business) {
            return { error: 'Unauthorized access to this business' };
        }

        // Now fetch the products
        const { data: products, error } = await supabase
            .from('products')
            .select('id, name')
            .eq('business_id', businessId);

        if (error) throw error;

        return { products };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { error: 'Failed to fetch products' };
    }
}

// Get all coupon tags
export async function getCouponTags() {
    try {
        const { data: tags, error } = await supabase
            .from('coupon_tags')
            .select('id, name');

        if (error) throw error;

        return { tags };
    } catch (error) {
        console.error('Error fetching coupon tags:', error);
        return { error: 'Failed to fetch tags' };
    }
}

export async function getAllCoupons(query = '', page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    // const session = await getServerSession(options);
    // const userId = session?.user?.id;
    const userId = await getUserId(); // Assuming you have a function to get the user ID
    let supabaseQuery = supabase
        .from('coupons')
        .select('*', { count: 'exact' }) // select all fields + count
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
        .eq("user_id", userId)

    if (query) {
        const lowerQuery = query.toLowerCase();
        supabaseQuery = supabaseQuery.or(`
            code.ilike.%${lowerQuery}%,
            title.ilike.%${lowerQuery}%,
            description.ilike.%${lowerQuery}%
        `);
    }

    const { data: coupons, count: totalCount, error } = await supabaseQuery;

    if (error) {
        console.error('Error fetching coupons:', error.message);
        return { coupons: [], totalCount: 0 };
    }

    return { coupons, totalCount };
}

export async function getCouponById(id) {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching coupon by ID:', error.message);
        return null;
    }

    return data;
}
export async function deleteCoupon(id) {
    const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting coupon:', error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}