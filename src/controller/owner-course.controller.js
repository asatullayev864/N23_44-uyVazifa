import Owner from "../models/owner-course.model.js";
import { BaseController } from "./base.controller.js";

class OwnerController extends BaseController {
    constructor() {
        super(Owner);
    }
}

export default new OwnerController();