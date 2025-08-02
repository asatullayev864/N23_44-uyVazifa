import { Router } from "express";
import controller from '../controller/owner-course.controller.js';
import { validate } from "../middlewares/validate.js";
import sallerValidation from '../validation/owner-courseValidation.js';
import ownerCourseController from "../controller/owner-course.controller.js";

const router = Router();



router
    .post('/', controller.createOwnerCourse)
    .post('/signin', validate(ownerCourseController.signin), controller.signin)
    .post('/token', controller.generateNewToken)
    .post('/signout', controller.signOut)

    .get('/', controller.findAll)
    .get('/:id', controller.findById)

    .delete('/:id', controller.delete)

export default router;