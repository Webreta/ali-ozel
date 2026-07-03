import "server-only";
import nodemailer from "nodemailer";
import { getSetting } from "@/lib/settings";

/**
 * Teklif/iletişim bildirimi maili. Öncelik sırası:
 *   1. Panelden yapılandırılmış SMTP (Ayarlar → SMTP & Formlar)
 *   2. RESEND_API_KEY env değişkeni (eski kurulum)
 *   3. Hiçbiri yoksa sessizce atlanır — mail, form kaydını asla bloklamaz.
 */

type SubmissionEmail = {
  kind: "contact" | "teklif";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  pagePath?: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildHtml(s: SubmissionEmail, kindLabel: string) {
  return `
    <h2>Yeni ${esc(kindLabel).toLowerCase()}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><b>Ad Soyad</b></td><td>${esc(s.name)}</td></tr>
      <tr><td><b>E-posta</b></td><td><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></td></tr>
      <tr><td><b>Telefon</b></td><td>${esc(s.phone ?? "—")}</td></tr>
      <tr><td><b>Sayfa</b></td><td>${esc(s.pagePath ?? "—")}</td></tr>
    </table>
    <p style="white-space:pre-wrap;border-left:3px solid #8c1d2c;padding-left:12px">${esc(s.message ?? "(Mesaj bırakılmamış)")}</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://aliozel.com.tr"}/admin/talepler">Panelde görüntüle →</a></p>`;
}

async function sendViaSmtp(s: SubmissionEmail, kindLabel: string) {
  const smtp = await getSetting("smtp");
  if (!smtp.enabled || !smtp.host) return false;

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.encryption === "ssl",
    requireTLS: smtp.encryption === "tls",
    auth: smtp.authEnabled
      ? { user: smtp.username, pass: smtp.password }
      : undefined,
    tls: smtp.skipTlsVerify ? { rejectUnauthorized: false } : undefined,
  });

  const fromAddress = smtp.fromEmail || smtp.username;
  await transporter.sendMail({
    from: smtp.fromName ? `"${smtp.fromName}" <${fromAddress}>` : fromAddress,
    to: smtp.notifyTo,
    replyTo: s.email,
    subject: `Yeni ${kindLabel}: ${s.name}`,
    html: buildHtml(s, kindLabel),
  });
  return true;
}

async function sendViaResend(s: SubmissionEmail, kindLabel: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const smtp = await getSetting("smtp");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM ?? "Aliozel Site <onboarding@resend.dev>",
      to: [process.env.NOTIFY_TO ?? smtp.notifyTo],
      subject: `Yeni ${kindLabel}: ${s.name}`,
      html: buildHtml(s, kindLabel),
      reply_to: s.email,
    }),
  });
  if (!res.ok) {
    console.error("Resend hatası:", res.status, await res.text());
  }
  return res.ok;
}

export async function sendSubmissionEmail(s: SubmissionEmail) {
  const kindLabel = s.kind === "teklif" ? "Teklif talebi" : "İletişim mesajı";
  try {
    const sent = await sendViaSmtp(s, kindLabel);
    if (!sent) await sendViaResend(s, kindLabel);
  } catch (e) {
    console.error("Bildirim maili hatası:", e);
  }
}
