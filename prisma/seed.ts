import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@ethiochina.org";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Community Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "SUPERADMIN",
    },
  });
  console.log(`Admin ready: ${adminEmail} / ${adminPassword}`);

  const memberSeeds = [
    { name: "Selam Tesfaye", email: "selam@example.com", university: "Tsinghua University", city: "Beijing", program: "Computer Science", verified: true },
    { name: "Daniel Bekele", email: "daniel@example.com", university: "Fudan University", city: "Shanghai", program: "International Business", verified: true },
    { name: "Hana Girma", email: "hana@example.com", university: "Zhejiang University", city: "Hangzhou", program: "Mechanical Engineering", verified: false },
    { name: "Yonas Alemu", email: "yonas@example.com", university: "Peking University", city: "Beijing", program: "Economics", verified: true },
    { name: "Ruth Mekonnen", email: "ruth@example.com", university: "Shanghai Jiao Tong University", city: "Shanghai", program: "Medicine", verified: false },
  ];

  const members = [];
  for (const m of memberSeeds) {
    const member = await prisma.member.upsert({
      where: { email: m.email },
      update: {},
      create: {
        ...m,
        passwordHash: await bcrypt.hash("Password123!", 10),
        verifiedBy: m.verified ? admin.id : null,
      },
    });
    members.push(member);
  }
  console.log(`Seeded ${members.length} demo members (password: Password123!)`);

  const resourceSeeds = [
    {
      title: "Welcome to EthioChina Hub",
      body: "Welcome! This hub is here to help Ethiopian students and community members in China connect, find resources, and get support. Complete your profile and an admin will verify you shortly.",
      category: "ANNOUNCEMENT" as const,
      pinned: true,
    },
    {
      title: "Visa renewal checklist for students",
      body: "1. Check your visa expiry date at least 30 days ahead.\n2. Gather your passport, enrollment certificate, and JW202 form.\n3. Visit your local Exit-Entry Administration office.\n4. Processing typically takes 5-7 business days.\n5. Contact the embassy if you run into issues with sponsorship letters.",
      category: "GUIDE" as const,
      pinned: false,
    },
    {
      title: "Community Meetup — Beijing",
      body: "Join fellow Ethiopian students for a community meetup in Beijing. Food, conversation, and a chance to meet people from other universities.",
      category: "EVENT" as const,
      pinned: false,
    },
    {
      title: "FAQ: Opening a Chinese bank account",
      body: "Most students can open an account at Bank of China or ICBC with their passport, visa, and university enrollment letter. Some branches require an on-campus address. Ask your university's international office for a bank-partnered branch.",
      category: "FAQ" as const,
      pinned: false,
    },
  ];

  for (const r of resourceSeeds) {
    const existing = await prisma.resource.findFirst({ where: { title: r.title } });
    if (!existing) {
      await prisma.resource.create({
        data: { ...r, authorId: admin.id, publishedAt: new Date() },
      });
    }
  }
  console.log(`Seeded ${resourceSeeds.length} demo resources`);

  const requestSeeds = [
    { memberIdx: 2, category: "VISA" as const, description: "My visa expires in 3 weeks and I'm not sure which documents I need for renewal.", status: "OPEN" as const },
    { memberIdx: 4, category: "HOUSING" as const, description: "Looking for help finding off-campus housing near Shanghai Jiao Tong University.", status: "IN_PROGRESS" as const },
    { memberIdx: 0, category: "ACADEMIC" as const, description: "Need guidance on transferring credits between programs.", status: "RESOLVED" as const },
  ];

  for (const r of requestSeeds) {
    const member = members[r.memberIdx];
    const existing = await prisma.supportRequest.findFirst({
      where: { memberId: member.id, description: r.description },
    });
    if (!existing) {
      await prisma.supportRequest.create({
        data: {
          memberId: member.id,
          category: r.category,
          description: r.description,
          status: r.status,
          assignedTo: r.status !== "OPEN" ? admin.id : null,
          resolvedAt: r.status === "RESOLVED" ? new Date() : null,
        },
      });
    }
  }
  console.log(`Seeded ${requestSeeds.length} demo support requests`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
