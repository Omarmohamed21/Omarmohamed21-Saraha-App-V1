import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"عمك عمر حسين "<${process.env.EMAIL}>`,
    to,
    subject,
    html
  });


  if (info.accepted.length > 0) return true;
  return false;
}
