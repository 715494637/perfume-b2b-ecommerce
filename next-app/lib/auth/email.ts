import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || '')
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com'

/**
 * 发送验证邮件
 * @param email 收件人邮箱
 * @param verificationToken 验证令牌
 */
export async function sendVerificationEmail(
  email: string,
  verificationToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${verificationToken}`

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '验证您的邮箱地址',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>欢迎加入香水电商网站</h1>
              </div>
              <div class="content">
                <p>您好，</p>
                <p>感谢您注册我们的平台！请点击下方按钮验证您的邮箱地址：</p>
                <p style="text-align: center;">
                  <a href="${verificationUrl}" class="button">验证邮箱</a>
                </p>
                <p>如果按钮无法点击，请复制以下链接到浏览器：</p>
                <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
                <p>此链接将在 24 小时后失效。</p>
              </div>
              <div class="footer">
                <p>如果您没有注册我们的平台，请忽略此邮件。</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('发送验证邮件失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '发送邮件失败',
    }
  }
}

/**
 * 发送密码重置邮件
 * @param email 收件人邮箱
 * @param resetToken 重置令牌
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '重置您的密码',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>重置密码</h1>
              </div>
              <div class="content">
                <p>您好，</p>
                <p>我们收到了您的密码重置请求。请点击下方按钮设置新密码：</p>
                <p style="text-align: center;">
                  <a href="${resetUrl}" class="button">重置密码</a>
                </p>
                <p>如果按钮无法点击，请复制以下链接到浏览器：</p>
                <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
                <div class="warning">
                  <p><strong>⚠️ 安全提示：</strong></p>
                  <p>• 此链接将在 1 小时后失效</p>
                  <p>• 如果您没有请求重置密码，请忽略此邮件</p>
                  <p>• 请勿将此链接分享给任何人</p>
                </div>
              </div>
              <div class="footer">
                <p>如果您有任何问题，请联系我们的客服。</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('发送重置邮件失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '发送邮件失败',
    }
  }
}

/**
 * 生成安全的随机令牌
 * @returns 随机令牌
 */
export function generateSecureToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}