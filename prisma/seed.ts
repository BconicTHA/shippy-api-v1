import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@shippy.com";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("adm_shi_001", 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      username: "admin",
      name: "System Admin",
      password: hashedPassword,
      address: "No 49/52, Colombo 03",
      phone: "0000000000",
      usertype: "admin",
    },
  });

  console.log("Admin created:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });