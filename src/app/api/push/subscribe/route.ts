import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const subscription = await req.json();

    if (!subscription || !subscription.endpoint) {
        return NextResponse.json({ message: 'Invalid subscription' }, { status: 400 });
    }

    await dbConnect();

    try {
        // Add subscription if it doesn't exist
        await User.findByIdAndUpdate(userId, {
            $addToSet: { pushSubscriptions: subscription }
        });
        return NextResponse.json({ message: 'Subscription saved successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
