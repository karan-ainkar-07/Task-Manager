import { customAlphabet } from 'nanoid';

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const generateCustomId = customAlphabet(alphabet, 16);

export function getCustomTaskId() {
  return generateCustomId(); 
}

