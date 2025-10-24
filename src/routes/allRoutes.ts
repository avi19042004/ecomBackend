import { Router } from "express";
import productRoutes from "./productRoutes"
import userRoutes from "./userRoutes"

const router = Router()

router.use(productRoutes)
router.use(userRoutes)

export default router;