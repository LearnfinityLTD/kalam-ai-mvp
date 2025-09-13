import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { email, subject, description, issueType } = await request.json();

    // Send confirmation email to the USER (from the form)
    const confirmationMsg = {
      to: email, // This is the user's email from the form
      from: "hello@kalam-ai.com",
      subject: "We received your feedback - KalamAI Support",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669 0%, #0284c7 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">KalamAI Support</h1>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #374151;">Thank you for your feedback!</h2>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">
              We've received your message and our support team will review it shortly. 
              Here's a summary of what you sent us:
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 0 0 10px 0;"><strong>Issue Type:</strong> ${issueType}</p>
              <p style="margin: 0;"><strong>Description:</strong></p>
              <p style="margin: 10px 0 0 0; padding: 10px; background: white; border-radius: 4px;">
                ${description}
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              We typically respond within 24-48 hours. If your issue is urgent, 
              please contact us directly at support@kalam-ai.com
            </p>
            
            <hr style="border: none; height: 1px; background: #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    // Send internal notification to support team
    const internalMsg = {
      to: "hello@kalam-ai.co.uk",
      from: "hello@kalam-ai.com",
      subject: `New Feedback: ${subject}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Issue Type:</strong> ${issueType}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Description:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${description}
        </div>
        <p><em>Submitted at: ${new Date().toISOString()}</em></p>
      `,
    };

    // Send both emails
    await Promise.all([sgMail.send(confirmationMsg), sgMail.send(internalMsg)]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send feedback" },
      { status: 500 }
    );
  }
}
