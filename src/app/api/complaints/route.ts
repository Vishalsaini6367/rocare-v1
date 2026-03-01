import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Complaint from '@/models/Complaint';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    await dbConnect();

    try {
        let complaints;
        if (role === 'admin') {
            complaints = await Complaint.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
        } else {
            complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });
        }
        return NextResponse.json(complaints);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    try {
        const { clientName, mobileNumber, location, problemDescription, lat, lng } = await req.json();

        if (!clientName || !mobileNumber || !location || !problemDescription) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        await dbConnect();
        const complaint = await Complaint.create({
            userId,
            clientName,
            mobileNumber,
            location,
            problemDescription,
            status: 'Pending',
            lat,
            lng,
        });

        return NextResponse.json(complaint, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
