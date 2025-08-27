import { hash } from 'bcryptjs'
export async function hashPassword(password: string, salt: number = 10): Promise<string> {
  return hash(password, salt);
}
