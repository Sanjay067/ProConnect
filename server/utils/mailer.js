import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const from = process.env.SMTP_FROM || "noreply@localhost";
  if (!getTransporter()) {
    console.log("[email:dev]", { to, subject, text: text?.slice?.(0, 200) });
    return { dev: true };
  }
  await getTransporter().sendMail({ from, to, subject, text, html });
}
