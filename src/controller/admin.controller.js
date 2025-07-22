import Admin from '../models/admin.model.js';
import { BaseController } from './base.controller.js';

class AdminController extends BaseController{
    constructor() {
        super(Admin)
    }
}