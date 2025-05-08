import { NextResponse } from "next/server"

export async function GET(request) {
    const data = {
        name: "John Doe",
        age: 30,
    }

    // return Response.json(data);
    return NextResponse.json(data)
}