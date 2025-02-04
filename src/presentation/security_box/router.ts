import { Router } from "express";
import { SecurityService } from "../services/security_controller.service";
import { SecurityBoxController } from "./controller";
import { UserService } from "../services/user.service";

export class SecurityRouter {
  static routes(): Router {
    const router = Router();

    const userService = new UserService();
    const securityService = new SecurityService(userService);
    const secrurityController = new SecurityBoxController(securityService);

    router.get("/:id", secrurityController.getOneSecurity);
    router.get("/", secrurityController.getAllSecurityBox);
    router.post("/", secrurityController.createSecurityBox);
    router.patch("/:id", secrurityController.editSecurity);
    router.delete("/:id", secrurityController.deleteSecurity);

    return router;
  }
}
