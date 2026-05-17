import { Router } from "express";
import healthRouter from "./health.js";
import teamRouter   from "./team/index.js";

const router = Router();

router.use(healthRouter);
router.use("/team", teamRouter);

export default router;
