import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        image: {
            type: String,
            default: '',
        },
        pushSubscriptions: [
            {
                endpoint: String,
                keys: {
                    p256dh: String,
                    auth: String,
                },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
