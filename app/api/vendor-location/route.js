import { getUserId } from "@/helpers/userHelper";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request){
    const userId = await getUserId();
    if(!userId){
        return Response.json({error: 'Unauthorized'}, {status: 401})
    }
    const {latitude, longitude} = await request.json();

    console.log(latitude, longitude,);


    const {data, error} = await supabaseAdmin
    .from('businesses')
    .update({latitude, longitude})
    .eq('user_id', userId)

    if(error){
        console.log("error in update vendor location", error)
        return Response.json({error: "Failed to update vendor location"}, {status: 500})
    }

    console.log(data)

    return Response.json({success: true, message: "Vendor location updated succesfully"}, {status : 200})

}