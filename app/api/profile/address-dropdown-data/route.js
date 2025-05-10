import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // Fetch area data
        const { data: areaData, error: areaError } = await supabaseAdmin.from("area").select("*");
        if (areaError) {
            console.error("Error fetching area data:", areaError);
            return NextResponse.json({ success: false, error: areaError.message }, { status: 500 });
        }

        // Fetch city data
        const { data: cityData, error: cityError } = await supabaseAdmin.from("city").select("*");
        if (cityError) {
            console.error("Error fetching city data:", cityError);
            return NextResponse.json({ success: false, error: cityError.message }, { status: 500 });
        }

        // Fetch state data
        const { data: stateData, error: stateError } = await supabaseAdmin.from("state").select("*");
        if (stateError) {
            console.error("Error fetching state data:", stateError);
            return NextResponse.json({ success: false, error: stateError.message }, { status: 500 });
        }

        // // console.log(areaData, cityData, stateData, "Address Dropdowns Data");

        // Return successful response with all data
        return NextResponse.json({
            success: true,
            areaData: areaData || [],
            cityData: cityData || [],
            stateData: stateData || [],
        });
    } catch (error) {
        console.error("Unexpected error in address dropdowns API:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}