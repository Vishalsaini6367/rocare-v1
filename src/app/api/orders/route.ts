import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { productId, clientName, mobileNumber, deliveryAddress, totalAmount, lat, lng } = body;

        if (!productId || !clientName || !mobileNumber || !deliveryAddress || !totalAmount) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();
        const newOrder = new Order({
            userId: (session.user as any).id,
            productId,
            clientName,
            mobileNumber,
            deliveryAddress,
            totalAmount,
            paymentMethod: 'Cash on Delivery',
            status: 'Pending',
            lat,
            lng,
        });

        await newOrder.save();

        // Notify admins
        const { notifyAdmins } = await import('@/lib/push');
        await notifyAdmins({
            title: 'New Product Order',
            body: `New order from ${clientName} for amount ₹${totalAmount}`,
            url: '/admin/orders'
        });

        return NextResponse.json({ message: 'Order placed successfully!', orderId: newOrder._id }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        let orders;
        if ((session.user as any).role === 'admin') {
            orders = await Order.find({}).sort({ createdAt: -1 }).populate('productId', 'name image price');
        } else {
            orders = await Order.find({ userId: (session.user as any).id }).sort({ createdAt: -1 }).populate('productId', 'name image price');
        }
        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
