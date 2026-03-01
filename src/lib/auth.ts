import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const ADMIN_EMAIL = 'vishalsaini00185@gmail.com';
                const ADMIN_PASSWORD = 'Gopal@9214';

                // Fixed admin credentials check
                if (credentials.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
                    if (credentials.password !== ADMIN_PASSWORD) {
                        return null; // Wrong password for admin
                    }
                    // Ensure admin exists in DB (upsert)
                    await dbConnect();
                    let adminUser = await User.findOne({ email: ADMIN_EMAIL });
                    if (!adminUser) {
                        const bcrypt = (await import('bcryptjs')).default;
                        const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
                        adminUser = await User.create({ name: 'Admin', email: ADMIN_EMAIL, password: hashed, role: 'admin' });
                    } else if (adminUser.role !== 'admin') {
                        adminUser = await User.findByIdAndUpdate(adminUser._id, { role: 'admin' }, { new: true });
                    }
                    return { id: adminUser!._id.toString(), name: adminUser!.name, email: adminUser!.email, role: 'admin' } as any;
                }

                // Normal user login
                await dbConnect();
                const user = await User.findOne({ email: credentials.email }).select('+password');
                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: 'user', // All non-admin users are always 'user'
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            if (trigger === "update" && session) {
                token.name = session.name || token.name;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
