import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

/**
 * 哈希密码
 * @param password 明文密码
 * @returns 哈希后的密码
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * 验证密码
 * @param password 明文密码
 * @param hashedPassword 哈希后的密码
 * @returns 是否匹配
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 是否符合强度要求
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('密码至少需要 8 个字符')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码需要包含至少一个小写字母')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码需要包含至少一个大写字母')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('密码需要包含至少一个数字')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}