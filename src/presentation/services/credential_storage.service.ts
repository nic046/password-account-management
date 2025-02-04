import { any } from "zod";
import { decryptData } from "../../config/crypto.adapter";
import { Status } from "../../config/regular-exp";
import { CredentialStorage } from "../../data";
import { CreateCredentialStorageDTO, CustomError } from "../../domain";
import { SecurityService } from "./security_controller.service";
import { PinService } from "./pin.service";

export class CredentialStorageService {
  constructor(
    public readonly securitySevice: SecurityService,
    public readonly pinService: PinService
  ) {}

  async getCredentialStorage() {
    try {
      const credentials = await CredentialStorage.find({
        relations: ["securityBox", "pin", "securityBox.user"],
        select: {
          id: true,
          account: true,
          password: true,
          description: true,
          code_1: true,
          code_2: true,
          securityBox: {
            id: true,
            name: true,
            favorite: true,
            icon: true,
            user: {
              id: true,
              name: true,
              surname: true,
              email: true,
              cellphone: true,
            },
          },
          pin: {
            id: true,
            code: true,
          },
        },
      });

      return credentials.map((credential) => ({
        ...credential,
        password: decryptData(credential.password),
      }));
    } catch (error) {
      throw CustomError.internalServer("Error getting the security box");
    }
  }

  async getOneCredentialStorage(id: string) {
    try {
      const credentialStorage = await CredentialStorage.findOne({
        where: {
          id,
          status: Status.ACTIVE,
        },
        relations: ["securityBox", "pin", "securityBox.user"],
        select: {
          id: true,
          account: true,
          password: true,
          description: true,
          code_1: true,
          code_2: true,
          securityBox: {
            id: true,
            name: true,
            favorite: true,
            icon: true,
            user: {
              id: true,
              name: true,
              surname: true,
              email: true,
              cellphone: true,
            },
          },
          pin: {
            id: true,
            code: true,
          },
        },
      });

      if (!credentialStorage)
        throw CustomError.notFound("CredentialStorage not found");

      credentialStorage.password = decryptData(credentialStorage.password);

      return credentialStorage;
    } catch (error) {
      throw CustomError.internalServer("Error getting the security box");
    }
  }

  async createCredentialStorage(credentialData: CreateCredentialStorageDTO) {
    const credential = new CredentialStorage();

    const securityBox = await this.securitySevice.getOneSecurity(
      credentialData.securityId
    );

    const pin = await this.pinService.getOnePin(credentialData.pinId);

    credential.account = credentialData.account;
    credential.password = credentialData.password;
    credential.description = credentialData.description;
    credential.code_1 = credentialData.code_1;
    credential.code_2 = credentialData.code_2;
    credential.securityId = credentialData.securityId;
    credential.pinId = credentialData.pinId;

    credential.securityBox = securityBox;
    credential.pin = pin;

    try {
      return await credential.save();
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer("Error creating Credential Storage");
    }
  }

  async updateCredentialStorage(
    id: string,
    credentialData: CreateCredentialStorageDTO
  ) {
    const credential = await this.getOneCredentialStorage(id);

    const securityBox = await this.securitySevice.getOneSecurity(
      credential.securityId
    );

    credential.account = credentialData.account;
    credential.password = credentialData.password;
    credential.description = credentialData.description;
    credential.code_1 = credentialData.code_1;
    credential.code_2 = credentialData.code_2;
    credential.securityId = credentialData.securityId;
    credential.pinId = credentialData.pinId;

    credential.securityBox = securityBox;

    try {
      return await credential.save();
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer("Error editing Credential Storage");
    }
  }

  async deleteCredentialStorage(id: string) {
    const credential = await this.getOneCredentialStorage(id);

    credential.status = Status.DELETED;

    try {
      return await credential.save();
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer("Error deleting Credential Storage");
    }
  }
}
