import Client from "../models/client.model.js";
import { BaseController } from "./base.controller.js";

class ClientController extends BaseController {
    constructor() {
        super(Client)
    }
}

export default new ClientController;