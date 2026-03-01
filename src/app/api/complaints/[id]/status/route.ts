import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Complaint from '@/models/Complaint';

export async function PATCH(req: NextRequest, { params }: any) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    try {
        const { status } = await req.json();

        if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        await dbConnect();
        const complaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
        if (!complaint) {
            return NextResponse.json({ message: 'Complaint not found' }, { status: 404 });
        }
        return NextResponse.json(complaint);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
