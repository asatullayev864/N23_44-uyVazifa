import Order from "../models/order.model.js";
import { BaseController } from "./base.controller.js";

class CourseController extends BaseController {
    constructor() {
        super(Order);
    }
}

export default new CourseController();