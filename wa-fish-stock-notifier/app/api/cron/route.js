import ProcessSubscriptionsServer from "@/cron/processSubscriptions";
import { NextResponse } from "next/server";



// To handle a GET request to /api
export async function GET(request) {
    ProcessSubscriptionsServer();
    return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

// To handle a POST request to /api
export async function POST(request) {
    ProcessSubscriptionsServer();
    return NextResponse.json({ message: "Hello World" }, { status: 200 });
}