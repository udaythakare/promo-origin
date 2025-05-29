import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * GET /api/vendors/categories
 * Fetch all business categories
 */
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from("business_categories")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            console.error("Error fetching categories:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to fetch categories. Please try again later.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: data || [],
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