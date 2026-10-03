"use client";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY =
  "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
const KEY = Buffer.from(ENCRYPTION_KEY, "hex");

export function encrypt(text: any) {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
    tag: authTag.toString("hex"),
  };
}

export function decrypt(data: any) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(data.iv, "hex"),
  );

  decipher.setAuthTag(Buffer.from(data.tag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data.content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
