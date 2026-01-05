import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!

/**
 * 发送邮件验证邮件
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: '验证您的邮箱地址',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">欢迎加入香水电商网站！</h2>
          <p style="color: #666; font-size: 16px;">请点击下面的链接验证您的邮箱地址：</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            验证邮箱
          </a>
          <p style="color: #999; font-size: 14px;">如果按钮无法点击，请复制以下链接到浏览器：</p>
          <p style="color: #999; font-size: 14px; word-break: break-all;">${verifyUrl}</p>
          <p style="color: #999; font-size: 14px;">此链接将在24小时后过期。</p>
        </div>
      `,
    })

    if (error) {
      console.error('发送验证邮件失败:', error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('发送验证邮件异常:', error)
    return { error: '发送邮件失败，请稍后重试' }
  }
}

/**
 * 发送密码重置邮件
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: '重置您的密码',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">重置密码</h2>
          <p style="color: #666; font-size: 16px;">请点击下面的链接重置您的密码：</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            重置密码
          </a>
          <p style="color: #999; font-size: 14px;">如果按钮无法点击，请复制以下链接到浏览器：</p>
          <p style="color: #999; font-size: 14px; word-break: break-all;">${resetUrl}</p>
          <p style="color: #999; font-size: 14px;">此链接将在1小时后过期。</p>
        </div>
      `,
    })

    if (error) {
      console.error('发送重置密码邮件失败:', error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('发送重置密码邮件异常:', error)
    return { error: '发送邮件失败，请稍后重试' }
  }
}