import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 测试上传商品图片
export async function uploadProductImage(file: File, productId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${productId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('products')
    .upload(fileName, file)

  if (error) {
    console.error('Error uploading product image:', error)
    return null
  }

  // 获取公开URL
  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(fileName)

  return publicUrl
}

// 测试上传用户头像
export async function uploadAvatar(file: File, userId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/avatar.${fileExt}`

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true
    })

  if (error) {
    console.error('Error uploading avatar:', error)
    return null
  }

  // 获取私有URL（需要签名）
  const { data: { signedUrl } } = await supabase.storage
    .from('avatars')
    .createSignedUrl(fileName, 60 * 60 * 24) // 24小时有效期

  return signedUrl
}