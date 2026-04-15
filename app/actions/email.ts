'use server'

import { sendApprovalEmail, sendWelcomeEmail } from '@/lib/email';

export async function triggerApprovalEmail(email: string, filmTitle: string, studioName: string) {
    if (!email) return { success: false, error: 'No recipient email provided' };
    return await sendApprovalEmail(email, filmTitle, studioName);
}

export async function triggerWelcomeEmail(email: string, studioName: string) {
    if (!email) return { success: false, error: 'No recipient email provided' };
    return await sendWelcomeEmail(email, studioName);
}
