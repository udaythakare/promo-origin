
import { NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth";
import { z } from "zod";

// Define validation schema using Zod
const vendorFormSchema = z.object({
    name: z.string().min(2, "Business name must be at least 2 characters"),
    description: z.string().optional(),
    category_id: z.string().min(1, "Category is required"),
    website: z.string().url("Invalid website URL").or(z.string().length(0)).optional(),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State/Province is required"),
    postal_code: z.string().min(4, "Valid postal/ZIP code is required"),
    area: z.string().optional(),
    country: z.string().optional(),
});


export async function POST(request) {
    try {
        // Authentication check
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

        // Extract user info from session
        const userId = session?.user?.id;
        const userEmail = session?.user?.email;

        // Parse request body
        const formData = await request.json();

        // Check if user already has a registered business
        const { data: existingBusiness, error: existingBusinessError } = await supabaseAdmin
            .from("businesses")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle();

        if (existingBusinessError) {
            console.error("Error checking existing business:", existingBusinessError);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to process your application. Please try again later.",
                },
                { status: 500 }
            );
        }

        // If user already has a business, don't allow a new submission
        if (existingBusiness) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You already have a registered business. You cannot submit another application.",
                },
                { status: 409 }
            );
        }

        // Validate form data
        const validationResult = vendorFormSchema.safeParse(formData);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation failed. Please check your inputs.",
                    errors: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        // Map form data to business data
        const businessData = {
            user_id: userId,
            name: formData.name,
            description: formData.description || "",
            category_id: formData.category_id,
            website: formData.website || "",
            phone: formData.phone,
            email: formData.email,
        };

        // Insert business data
        const { data: businessDataResponse, error: businessDataError } = await supabaseAdmin
            .from("businesses")
            .insert(businessData)
            .select("id")
            .single();

        if (businessDataError) {
            console.error("Supabase business insertion error:", businessDataError);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to submit your application. Please try again later.",
                },
                { status: 500 }
            );
        }

        // Map form data to business location data
        const businessLocationData = {
            business_id: businessDataResponse.id,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            area: formData.area,
            country: formData.country || "India",
        };

        // Insert business location data
        const { data: businessLocationDataResponse, error: businessLocationDataError } = await supabaseAdmin
            .from("business_locations")
            .insert(businessLocationData);

        if (businessLocationDataError) {
            console.error("Supabase location insertion error:", businessLocationDataError);
            // Clean up the business data if the location insertion failed
            await supabaseAdmin.from("businesses").delete().eq("id", businessDataResponse.id);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to submit your application. Please try again later.",
                },
                { status: 500 }
            );
        }

        // Assign user role
        const { data: userRoleData, error: userRoleError } = await supabaseAdmin
            .from("user_roles")
            .insert({
                user_id: userId,
                role: "app_business_owner"
            });

        if (userRoleError) {
            console.error("Supabase user role insertion error:", userRoleError);
            // Clean up the business data if the user role insertion failed
            await supabaseAdmin.from("businesses").delete().eq("id", businessDataResponse.id);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to submit your application. Please try again later.",
                },
                { status: 500 }
            );
        }

        // Success response
        return NextResponse.json(
            {
                success: true,
                message: "Vendor application submitted successfully!",
                data: {
                    businessId: businessDataResponse.id
                },
            },
            { status: 201 }
        );

    } catch (error) {
        // Catch and handle any unexpected errors
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
