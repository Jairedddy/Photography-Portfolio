import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

const defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://[::1]:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://[::1]:5173",
];

const normalizeOrigin = (value = "") => value.replace(/\/+$/, "");

const allowedOrigins = (process.env.CLIENT_ORIGIN || defaultOrigins.join(","))
  .split(",")
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

const requiredEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "TO_ADDRESS"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.warn(
    `[api/contact] Missing environment variables: ${missingEnv.join(
      ", ",
    )}. Email sending will fail until these are set.`,
  );
}

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
};

const setCorsHeaders = (res: VercelResponse, origin: string | undefined, allowOrigin: boolean) => {
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (allowOrigin && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const originHeader = req.headers.origin ? normalizeOrigin(req.headers.origin) : undefined;
  const isAllowedOrigin = !originHeader || allowedOrigins.includes(originHeader);

  setCorsHeaders(res, originHeader, isAllowedOrigin);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!isAllowedOrigin) {
    res.status(403).json({ error: "Not allowed by CORS" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, subject, message } = (req.body as Record<string, string>) ?? {};

  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  try {
    const mailer = getTransporter();
    
    // Detect if this is a license request
    const isLicenseRequest = subject.toLowerCase().includes('license request') || 
                             message.toLowerCase().includes('license request');
    
    // Format email body
    let emailBody = `Name: ${name}\nEmail: ${email}\n`;
    
    if (isLicenseRequest) {
      emailBody += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      emailBody += `📸 LICENSE REQUEST\n`;
      emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }
    
    emailBody += `${message}`;
    
    await mailer.sendMail({
      from: `"Photography Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.TO_ADDRESS,
      replyTo: email,
      subject: `[Photography Portfolio] ${subject}`,
      text: emailBody,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[api/contact] Failed to send message", error);
    res.status(500).json({ error: "Unable to send message right now." });
  }
}

