import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendFreeRouteEmail(
  email: string,
  routeTitle: string,
  downloadToken: string
) {
  const downloadUrl = `${process.env.NEXTAUTH_URL}/api/routes/download/${downloadToken}`
  
  return sendEmail({
    to: email,
    subject: `Your Free Route: ${routeTitle}`,
    html: `
      <h1>Thanks for your interest!</h1>
      <p>Here's your download link for <strong>${routeTitle}</strong>:</p>
      <p><a href="${downloadUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Route</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>Explore more routes at our marketplace!</p>
    `,
  })
}

export async function sendPurchaseConfirmationEmail(
  email: string,
  routeTitle: string,
  downloadUrl: string
) {
  return sendEmail({
    to: email,
    subject: `Purchase Confirmation: ${routeTitle}`,
    html: `
      <h1>Purchase Confirmed!</h1>
      <p>Thank you for your purchase of <strong>${routeTitle}</strong>.</p>
      <p><a href="${downloadUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Your Route</a></p>
      <p>You can access this route anytime from your dashboard.</p>
    `,
  })
}
