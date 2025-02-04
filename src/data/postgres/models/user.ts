import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SecurityBox } from "./security_box";
import { Status } from "../../../config/regular-exp";
import { encriptAdapter } from "../../../config/bcrypt.adapter";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 100,
    nullable: false,
  })
  name: string;

  @Column("varchar", {
    length: 100,
    nullable: false,
  })
  surname: string;

  @Column("varchar", {
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column("varchar", {
    length: 20,
    nullable: false,
  })
  cellphone: string;

  @Column("varchar", {
    length: 225,
    nullable: false,
  })
  password: string;

  @Column("enum", {
    enum: Status,
    default: Status.ACTIVE,
  })
  status: string;

  @OneToMany(() => SecurityBox, (securityBox) => securityBox.user)
  security_boxes: SecurityBox[];

  @BeforeInsert()
  encryptedPassword() {
    this.password = encriptAdapter.hash(this.password);
  }
}
