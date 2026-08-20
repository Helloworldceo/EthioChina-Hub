import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<{ allowed: boolean }> {
  const since = new Date(Date.now() - windowMs);

  const count = await prisma.rateLimitAttempt.count({
    where: { key, createdAt: { gte: since } },
  });

  if (count >= maxAttempts) {
    return { allowed: false };
  }

  await prisma.rateLimitAttempt.create({ data: { key } });
  return { allowed: true };
}
