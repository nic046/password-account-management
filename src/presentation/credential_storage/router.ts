import { Router } from "express";
import { CredentialStorageController } from "./controller";
import { CredentialStorageService } from "../services/credential_storage.service";
import { SecurityService } from "../services/security_controller.service";
import { UserService } from "../services/user.service";
import { PinService } from "../services/pin.service";

export class CredentialRouter {
  static routes(): Router {
    const router = Router();

    const userService = new UserService()
    const securitySevice = new SecurityService(userService)
    const pinService = new PinService()
    const credentialService = new CredentialStorageService(securitySevice, pinService)
    const credentialController = new CredentialStorageController(credentialService)

    router.get("/:id", credentialController.getOneCredential);
    router.get("/", credentialController.getAllCredentials);
    router.post("/", credentialController.createCredential);
    router.patch("/:id", credentialController.editCredential);
    router.delete("/:id", credentialController.deleteCredential);

    return router;
  }
}
