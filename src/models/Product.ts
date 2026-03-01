import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a product name'],
        },
        image: {
            type: String,
            required: [true, 'Please provide a product image URL or base64'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide a product price'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a product description'],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
