import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        clientName: {
            type: String,
            required: [true, 'Please provide a name'],
        },
        mobileNumber: {
            type: String,
            required: [true, 'Please provide a mobile number'],
        },
        deliveryAddress: {
            type: String,
            required: [true, 'Please provide a delivery address'],
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            default: 'Cash on Delivery',
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        lat: Number,
        lng: Number,
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
