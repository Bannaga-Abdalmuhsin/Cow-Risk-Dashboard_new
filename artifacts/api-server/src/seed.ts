import { db, teamUsersTable } from "@workspace/db";
import { logger } from "./lib/logger.js";

const SEED_USERS = [
  { name: "ACES Admin", role: "manager",     pin: "1234" },
  { name: "Tech-01",    role: "technician",  pin: "0001" },
  { name: "Tech-02",    role: "technician",  pin: "0002" },
  { name: "Tech-03",    role: "technician",  pin: "0003" },
  { name: "Tech-04",    role: "technician",  pin: "0004" },
  { name: "Tech-05",    role: "technician",  pin: "0005" },
  { name: "Tech-06",    role: "technician",  pin: "0006" },
  { name: "Tech-07",    role: "technician",  pin: "0007" },
  { name: "Tech-08",    role: "technician",  pin: "0008" },
  { name: "Tech-09",    role: "technician",  pin: "0009" },
  { name: "Tech-10",    role: "technician",  pin: "0010" },
  { name: "Tech-11",    role: "technician",  pin: "0011" },
  { name: "Tech-12",    role: "technician",  pin: "0012" },
  { name: "Tech-13",    role: "technician",  pin: "0013" },
  { name: "Tech-14",    role: "technician",  pin: "0014" },
  { name: "Tech-15",    role: "technician",  pin: "0015" },
  { name: "Tech-16",    role: "technician",  pin: "0016" },
];

export async function seedTeam(): Promise<void> {
  const existing = await db.select().from(teamUsersTable).limit(1);
  if (existing.length > 0) {
    logger.info("Team users already seeded — skipping");
    return;
  }
  await db.insert(teamUsersTable).values(SEED_USERS);
  logger.info({ count: SEED_USERS.length }, "Team users seeded");
}
