import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalEmail(to: string, filmTitle: string, studioName: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'World Wood <hq@worldwood.ai>', 
            to: [to],
            subject: '🎬 Your Film has been Approved! - World Wood DCSB',
            html: `
                <div style="font-family: sans-serif; background: #0a0a0a; color: white; padding: 40px; border-radius: 12px; border: 1px solid #333;">
                    <h1 style="color: #ff3333; margin-bottom: 24px;">Congratulations, ${studioName}!</h1>
                    <p style="font-size: 18px; line-height: 1.6;">We are thrilled to inform you that your film <strong>"${filmTitle}"</strong> has passed the DCSB Digital Cinema Standards audit.</p>
                    <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <p style="margin: 0; color: #888;">Status: <span style="color: #00ff88; font-weight: bold;">APPROVED</span></p>
                        <p style="margin: 10px 0 0 0; color: #888;">Hall: <span style="color: white;">Global Feed</span></p>
                    </div>
                    <p style="font-size: 16px;">Your film is now live on the platform and ready for audiences to experience.</p>
                    <a href="https://worldwood.ai/feed" style="display: inline-block; background: #ff3333; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; margin-top: 20px;">View Live Feed</a>
                    <hr style="border: none; border-top: 1px solid #333; margin: 40px 0;">
                    <p style="font-size: 12px; color: #555;">&copy; 2026 World Wood Platform. All rights reserved.</p>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Email caught error:', err);
        return { success: false, error: err };
    }
}

export async function sendWelcomeEmail(to: string, studioName: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'World Wood <onboarding@worldwood.ai>',
            to: [to],
            subject: '✨ Welcome to World Wood Studio Registration!',
            html: `
                <div style="font-family: sans-serif; background: #0a0a0a; color: white; padding: 40px; border-radius: 12px; border: 1px solid #333;">
                    <h1 style="color: #ff3333; margin-bottom: 24px;">Welcome to the Future of Cinema, ${studioName}</h1>
                    <p style="font-size: 18px; line-height: 1.6;">Your studio is now registered on the World Wood collective. You can now start uploading your AI-native films for global distribution.</p>
                    <a href="https://worldwood.ai/studio/upload" style="display: inline-block; background: #ff3333; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; margin-top: 20px;">Upload Your First Film</a>
                    <hr style="border: none; border-top: 1px solid #333; margin: 40px 0;">
                    <p style="font-size: 12px; color: #555;">&copy; 2026 World Wood Platform. All rights reserved.</p>
                </div>
            `
        });

        if (error) return { success: false, error };
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err };
    }
}
