import { Router } from "express";
import controller from '../controller/admin.controller.js';
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/role.guard.js";
import { validate } from "../middlewares/validate.js";
import adminValidation from "../validation/adminValidation.js";
import { requestLimiter } from "../utils/request-limit.js";

const router = Router();

router
    // POST
    .post('/', AuthGuard, RolesGuard('SUPERADMIN'), validate(adminValidation.create), controller.createAdmin)
    .post('/signin', requestLimiter(60, 10), validate(adminValidation.signin), controller.signIn)
    .post('/token', controller.generateNewToken)
    .post('/signout', AuthGuard, controller.signOut)
    
    // GET
    .get('/', AuthGuard, RolesGuard('SUPERADMIN'), controller.findAll)
    .get('/:id', AuthGuard, RolesGuard('SUPERADMIN', 'ID'), controller.findById)
    
    // PATCH
    .patch('/password/:id', AuthGuard, RolesGuard('SUPERADMIN', 'ID'), validate(adminValidation.password), controller.updatePasswordForAdmin)
    .patch('/forget-password', validate(adminValidation.forgetPassword), controller.forgetPassword)
    .patch('/confirm-otp', validate(adminValidation.confirmOTP), controller.confirmOTP)
    .patch('/confirm-password', validate(adminValidation.confirmPassword), controller.confirmPassword)
    .patch('/:id', AuthGuard, RolesGuard('SUPERADMIN', 'ID'), validate(adminValidation.update), controller.update)
    
    // DELETE
    .delete('/:id', AuthGuard, RolesGuard('SUPERADMIN'), controller.delete)

export default router;
