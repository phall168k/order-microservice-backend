import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { PermissionEntity } from "../../permission/entities/permission.entity";
import { BaseEntity } from "@app/database/entities/base.entity";

@Entity({
  name: "roles",
})
export class RoleEntity extends BaseEntity {
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

  @Column({
    name: "created_by_user_id",
    type: "integer",
    nullable: true,
  })
  createdByUserId: number;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({
    name: "created_by_user_id",
  })
  createdByUser: UserEntity;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable({
    name: "role_permissions",
    joinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "permission_id",
      referencedColumnName: "id",
    },
  })
  permissions: PermissionEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

  constructor(partial?: Partial<RoleEntity>) {
    super();
    Object.assign(this, partial);
  }
}
