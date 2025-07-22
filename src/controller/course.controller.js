import Course from "../models/course.model.js";
import { BaseController } from "./base.controller.js";

class CourseVideosController extends BaseController {
    constructor() {
        super(Course);
    }
}

export default new CourseVideosController();
