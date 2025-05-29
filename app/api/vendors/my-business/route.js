import { NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth";

/**
 * GET /api/vendors/my-business
 * Get current user's business
 */
export async function GET() {
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

        const userId = session.user.id;

        const { data, error } = await supabaseAdmin
            .from("businesses")
            .select(`
                *,
                business_locations(*),
                business_categories(name, id)
            `)
            .eq("user_id", userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No business found for user
                return NextResponse.json(
                    {
                        success: true,
                        data: null,
                        message: "No business registered for this user.",
                    },
                    { status: 200 }
                );
            }

            console.error("Error fetching user business:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to fetch business details.",
                },
                { status: 500 }
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