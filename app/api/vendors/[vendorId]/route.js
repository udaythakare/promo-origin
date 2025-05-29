import { NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth";

/**
 * GET /api/vendors/[vendorId]
 * Get vendor details by ID
 */
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(options);
        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required. Please log in to continue.",
                },
                { status: 401 }
            );
        }

        const { vendorId } = params;

        const { data, error } = await supabaseAdmin
            .from("businesses")
            .select(`
                *,
                business_locations(*),
                business_categories(name, id)
            `)
            .eq("id", vendorId)
            .single();

        if (error) {
            console.error("Error fetching vendor:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: "Vendor not found.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: data,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Server action error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An unexpected error occurred. Please try again later.",
            },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/vendors/[vendorId]
 * Update vendor details
 */
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(options);
        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required. Please log in to continue.",
                },
                { status: 401 }
            );
        }

        const { vendorId } = params;
        const updateData = await request.json();

        // Check if the business belongs to the current user
        const { data: existingBusiness, error: checkError } = await supabaseAdmin
            .from("businesses")
            .select("user_id")
            .eq("id", vendorId)
            .single();

        if (checkError || !existingBusiness) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Business not found.",
                },
                { status: 404 }
            );
        }

        if (existingBusiness.user_id !== session.user.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized to update this business.",
                },
                { status: 403 }
            );
        }

        // Update business data
        const { data, error } = await supabaseAdmin
            .from("businesses")
            .update(updateData)
            .eq("id", vendorId)
            .select()
            .single();

        if (error) {
            console.error("Error updating vendor:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to update vendor. Please try again later.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Vendor updated successfully!",
                data: data,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Server action error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An unexpected error occurred. Please try again later.",
            },
            { status: 500 }
        );
    }
}