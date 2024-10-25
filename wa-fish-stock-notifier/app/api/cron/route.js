import processSubscriptionsCron from "@/cron/processSubscriptionsCron";
import { NextResponse } from "next/server";



// To handle a GET request to /api
export async function GET(request) {
    const resultJSON = await processSubscriptionsCron();
    return NextResponse.json({ message: JSON.stringify(resultJSON ?? {}, null, 2) }, { status: 200 });
}

// To handle a POST request to /api
export async function POST(request) {
    const resultJSON = await processSubscriptionsCron();
    return NextResponse.json({ message: JSON.stringify(resultJSON ?? {}, null, 2) }, { status: 200 });
}