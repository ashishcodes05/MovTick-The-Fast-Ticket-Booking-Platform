import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendEmail = async (to, subject, body) => {
    try {
        console.log("Attempting to send email to:", to);
        console.log("Email subject:", subject);
        console.log("SMTP Config:", {
            host: "smtp-relay.brevo.com",
            port: 587,
            user: process.env.SMTP_USER,
            from: process.env.SENDER_EMAIL
        });
        
        const response = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html: body
        });
        
        console.log("Email sent successfully:", response.messageId);
        return response;
    } catch (error) {
        console.error("Email sending error:", error);
        throw error;
    }
}

export default sendEmail;