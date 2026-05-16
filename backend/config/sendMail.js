import dotenv from "dotenv"
dotenv.config()

const {
    BREVO_API_KEY,
    BREVO_SENDER_EMAIL,
    BREVO_SENDER_NAME = "Learnova Support",
} = process.env

const sendMail = async (to, otp) => {
    if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
        throw new Error("Brevo email credentials are not configured")
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            sender: {
                name: BREVO_SENDER_NAME,
                email: BREVO_SENDER_EMAIL,
            },
            to: [{ email: to }],
            subject: "Your Learnova password reset code",
            textContent: `Your Learnova password reset code is ${otp}. This code expires in 5 minutes. If you did not request this, you can safely ignore this email.`,
            htmlContent: `
                <div style="margin:0;padding:0;background:#f6f9ff;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f9ff;padding:32px 16px;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #dbeafe;border-radius:12px;overflow:hidden;">
                                    <tr>
                                        <td style="padding:28px 32px 18px;border-bottom:1px solid #e2e8f0;">
                                            <h1 style="margin:0;font-size:24px;line-height:32px;color:#0f172a;">Reset your Learnova password</h1>
                                            <p style="margin:8px 0 0;font-size:14px;line-height:22px;color:#64748b;">Use the verification code below to continue resetting your password.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:30px 32px;">
                                            <p style="margin:0 0 14px;font-size:15px;line-height:24px;color:#334155;">Your password reset code is:</p>
                                            <div style="margin:0 0 20px;padding:18px 24px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;text-align:center;">
                                                <span style="font-size:34px;line-height:40px;font-weight:700;letter-spacing:10px;color:#2563eb;">${otp}</span>
                                            </div>
                                            <p style="margin:0;font-size:14px;line-height:22px;color:#475569;">This code expires in <strong>5 minutes</strong>. For your security, do not share this code with anyone.</p>
                                            <p style="margin:18px 0 0;font-size:14px;line-height:22px;color:#64748b;">If you did not request a password reset, you can safely ignore this email. Your account will remain secure.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                                            <p style="margin:0;font-size:12px;line-height:18px;color:#94a3b8;">This is an automated message from Learnova. Please do not reply to this email.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            `,
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Brevo failed to send email: ${errorText}`)
    }
}

export default sendMail
