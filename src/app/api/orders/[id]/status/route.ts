import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PATCH(req: NextRequest, { params }: any) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    try {
        const { status } = await req.json();

        if (!['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        await dbConnect();
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // Notify user
        const { notifyUser } = await import('@/lib/push');
        await notifyUser(order.userId.toString(), {
            title: 'Order Status Updated',
            body: `Your order status has been updated to: ${status}`,
            url: '/dashboard'
        });

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
