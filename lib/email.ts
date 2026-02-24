import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendMagicLink(email: string, token: string) {
  const magicLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify?token=${token}`
  
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@njord.com',
      to: email,
      subject: 'Sign in to Njord Support Portal',
      html: `
        <h2>Sign in to Njord Support Portal</h2>
        <p>Click the link below to sign in:</p>
        <p><a href="${magicLink}">${magicLink}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    })
    return true
  } catch (error) {
    console.error('Error sending magic link:', error)
    return false
  }
}

