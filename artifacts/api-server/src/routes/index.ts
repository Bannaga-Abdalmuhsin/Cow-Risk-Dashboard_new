import { Router } from "express";
import healthRouter  from "./health.js";
import teamRouter    from "./team/index.js";
import faultsRouter  from "./faults/index.js";

const router = Router();

router.use(healthRouter);
router.use("/team",   teamRouter);
router.use("/faults", faultsRouter);

export default router;
