import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in .env file");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const args = process.argv.slice(2);
  const targetEmail = args[0];

  if (!targetEmail) {
    console.log("\n📋 DANH SÁCH NGƯỜI DÙNG HIỆN TẠI:");
    console.log("--------------------------------------------------");
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (users.length === 0) {
      console.log("Chưa có tài khoản nào trong Database.");
    } else {
      users.forEach((u) => {
        console.log(`- Email: ${u.email} | Tên: ${u.name || "N/A"} | Vai trò: ${u.role}`);
      });
    }

    console.log("--------------------------------------------------");
    console.log("\n💡 HƯỚNG DẪN CẬP NHẬT VAI TRÒ SANG ADMIN:");
    console.log("Chạy lệnh dưới đây kèm theo email của bạn để set quyền ADMIN:");
    console.log("👉 npx ts-node list-and-update.ts <email_cua_ban>\n");
  } else {
    console.log(`\n⏳ Đang cập nhật vai trò cho tài khoản: ${targetEmail}...`);
    
    try {
      const user = await prisma.user.findUnique({
        where: { email: targetEmail },
      });

      if (!user) {
        console.error(`❌ Không tìm thấy người dùng có email: ${targetEmail}`);
        process.exit(1);
      }

      const updatedUser = await prisma.user.update({
        where: { email: targetEmail },
        data: { role: "ADMIN" },
      });

      console.log(`\n✅ CẬP NHẬT THÀNH CÔNG!`);
      console.log(`--------------------------------------------------`);
      console.log(`- Email: ${updatedUser.email}`);
      console.log(`- Tên: ${updatedUser.name || "N/A"}`);
      console.log(`- Vai trò mới: ${updatedUser.role}`);
      console.log(`--------------------------------------------------\n`);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật database:", err);
    }
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error("❌ Script error:", err);
  process.exit(1);
});
