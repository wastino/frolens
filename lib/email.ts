import { createTransport } from "nodemailer";

interface OrderEmailPayload {
  customerEmail: string;
  customerName: string;
  orderId: number;
  photoKey: string;
  size: string;
  paper: string;
  qty: number;
  total: number;
}

export async function sendOrderConfirmationEmail(payload: OrderEmailPayload): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "frolensphotography@gmail.com";

  if (!host || !user || !pass) return false;

  const transporter = createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: payload.customerEmail,
    subject: `Frolens print order confirmation #${payload.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2 style="margin-bottom: 0.4rem;">Thank you for your order, ${payload.customerName}.</h2>
        <p>Your print order has been received and is being prepared for review.</p>
        <p><strong>Order:</strong> #${payload.orderId}<br />
        <strong>Photo:</strong> ${payload.photoKey}<br />
        <strong>Size:</strong> ${payload.size}<br />
        <strong>Paper:</strong> ${payload.paper}<br />
        <strong>Quantity:</strong> ${payload.qty}<br />
        <strong>Total:</strong> €${payload.total}</p>
        <p>We will be in touch shortly with payment and delivery details.</p>
      </div>
    `,
  });

  return true;
}
