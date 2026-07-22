import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "../../role/entities/role.entity";
import { BaseEntity } from "@app/database/entities/base.entity";

@Entity({ name: "permissions" })
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: "id",
  })
  id: number;

  @Column({
    name: "name",
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  name: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];

  constructor(partial?: Partial<PermissionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
