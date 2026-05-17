import app from "./app.js";
import { logger } from "./lib/logger.js";
import { seedTeam } from "./seed.js";

const PORT = Number(process.env.PORT ?? 8080);

app.listen(PORT, "0.0.0.0", async () => {
  logger.info({ port: PORT }, "API server started");
  try {
    await seedTeam();
  } catch (err) {
    logger.error({ err }, "Seed failed — continuing anyway");
  }
});
