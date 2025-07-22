import CourseVideos from "../models/course-videos.model.js";
import { BaseController } from "./base.controller.js";

class CourseVideosController extends BaseController {
    constructor() {
        super(CourseVideos);
    }
}

export default new CourseVideosController();