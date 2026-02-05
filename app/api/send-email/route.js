import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request) {
    try {
        const { email, subject, message } = await request.json();

        if (!email || !subject || !message) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: `LocalGrow <${process.env.FROM_EMAIL || 'noreply@yourdomain.com'}>`,
            to: email,
            subject: subject,
            html: message
        });

        if (error) {
            console.error('Resend API error:', error);
            return NextResponse.json(
                { success: false, message: 'Failed to send email', error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            id: data?.id
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send email' },
            { status: 500 }
        );
    }
}