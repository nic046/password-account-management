import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CredentialStorage } from "./credential_storage";

@Entity()
export class Pin extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 6,
    nullable: false,
  })
  code: string;

  @OneToMany(() => CredentialStorage, credentialStorage => credentialStorage.pin)
  credentialsStorage: CredentialStorage[]
}
