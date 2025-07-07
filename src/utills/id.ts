import { customAlphabet } from "nanoid";

export const getId = (length: number = 10): string => {
    const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", length);
    return nanoid(7); // Generate a random ID of specified length 7 Characters
};