import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Complaint from '@/models/Complaint';
import Order from '@/models/Order';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    try {
        const totalComplaints = await Complaint.countDocuments();
        const completedComplaints = await Complaint.countDocuments({ status: 'Completed' });
        const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
        const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });

        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });

        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });

        return NextResponse.json({
            totalComplaints,
            completedComplaints,
            pendingComplaints,
            inProgressComplaints,
            totalOrders,
            pendingOrders,
            totalProducts,
            totalUsers
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
