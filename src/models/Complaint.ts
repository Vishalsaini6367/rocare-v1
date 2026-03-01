import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        clientName: {
            type: String,
            required: [true, 'Please provide client name'],
        },
        mobileNumber: {
            type: String,
            required: [true, 'Please provide client mobile number'],
        },
        location: {
            type: String,
            required: [true, 'Please provide client location'],
        },
        problemDescription: {
            type: String,
            required: [true, 'Please provide problem description'],
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending',
        },
        lat: Number,
        lng: Number,
    },
    { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);
