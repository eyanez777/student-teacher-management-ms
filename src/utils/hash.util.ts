export async function hashPassword(password: string, salt: number = 10): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, salt);
}
