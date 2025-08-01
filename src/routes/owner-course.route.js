import { Router } from "express";
import controller from '../controller/owner-course.controller.js';

const router = Router();

router
    .post('/', controller.createOwnerCourse)

export default router;