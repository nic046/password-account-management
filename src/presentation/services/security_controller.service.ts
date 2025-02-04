import { Status } from "../../config/regular-exp";
import { SecurityBox } from "../../data";
import { CreateSecurityBoxDTO, CustomError } from "../../domain";
import { UserService } from "./user.service";

export class SecurityService {
  constructor(public readonly userService: UserService) {}

  async showSecurity() {
    try {
      return await SecurityBox.find({
        relations: ["user"],
        select: {
          user: {
            id: true,
            name: true,
            surname: true,
            email: true,
            cellphone: true,
            status: true,
          },
        },
      });
    } catch (error) {
      throw CustomError.internalServer("Error getting the security box");
    }
  }

  async getOneSecurity(id: string) {
    const security = await SecurityBox.findOne({
      where: {
        id,
        status: Status.ACTIVE,
      },
      relations: ["user"],
      select: {
        user: {
          id: true,
          name: true,
          surname: true,
          email: true,
          cellphone: true,
          status: true,
        },
      },
    });
    if (!security) {
      throw CustomError.notFound("Security box not found");
    }
    return security;
  }

  async createSecurity(securityData: CreateSecurityBoxDTO) {
    const security = new SecurityBox();
    const user = await this.userService.getOneUser(securityData.userId);

    security.name = securityData.name;
    security.favorite = securityData.favorite;
    security.icon = securityData.icon;
    security.userId = securityData.userId;
    security.user = user;

    try {
      return await security.save();
    } catch (error: any) {
      console.log(error);
      throw CustomError.internalServer("Error creating security box");
    }
  }

  async updateSecurity(id: string, securityData: CreateSecurityBoxDTO) {
    const security = await this.getOneSecurity(id);

    const user = await this.userService.getOneUser(securityData.userId);

    security.name = securityData.name;
    security.favorite = securityData.favorite;
    security.icon = securityData.icon;
    security.user = user;

    try {
      return await security.save();
    } catch (error: any) {
      console.log(error);
      throw CustomError.internalServer("Error creating security box");
    }
  }

  async deleteSecurity(id: string) {
    const security = await this.getOneSecurity(id);

    security.status = Status.DELETED;

    try {
      return await security.save();
    } catch (error: any) {
      console.log(error);
      throw CustomError.internalServer("Error deleting security box");
    }
  }
}
