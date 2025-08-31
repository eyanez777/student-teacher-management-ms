import { hash,compare } from 'bcryptjs'

export async function hashPassword(password: string, salt: number = 10): Promise<string> {
  return hash(password, salt);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}
