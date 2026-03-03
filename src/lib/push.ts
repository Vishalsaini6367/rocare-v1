import webpush from 'web-push';

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
    webpush.setVapidDetails(
        'mailto:support@rocare.com',
        publicVapidKey,
        privateVapidKey
    );
} else {
    console.warn('VAPID keys are not set. Push notifications will not work.');
}

export async function sendNotification(subscription: any, payload: any) {
    if (!publicVapidKey || !privateVapidKey) {
        console.error('Cannot send notification: VAPID keys are missing');
        return;
    }
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error) {
        console.error('Error sending notification', error);
    }
}

export async function notifyAdmins(payload: any) {
    const User = (await import('@/models/User')).default;
    const admins = await User.find({ role: 'admin' });

    for (const admin of admins) {
        if (admin.pushSubscriptions && admin.pushSubscriptions.length > 0) {
            for (const sub of admin.pushSubscriptions) {
                await sendNotification(sub, payload);
            }
        }
    }
}

export async function notifyUser(userId: string, payload: any) {
    const User = (await import('@/models/User')).default;
    const user = await User.findById(userId);

    if (user && user.pushSubscriptions && user.pushSubscriptions.length > 0) {
        for (const sub of user.pushSubscriptions) {
            await sendNotification(sub, payload);
        }
    }
}
