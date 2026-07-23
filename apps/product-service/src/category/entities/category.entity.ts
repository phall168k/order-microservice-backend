import { BaseEntity } from "@app/database/entities/base.entity";
import { UserEntity } from "apps/auth-service/src/user/entities/user.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({
  name: "categories",
})
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: "id",
  })
  id: number;

  @Column({
    name: "name_en",
    type: "varchar",
    unique: true,
    length: "250",
    nullable: false,
  })
  nameEn: string;

  @Column({
    name: "name_kh",
    type: "varchar",
    unique: true,
    length: "250",
    nullable: false,
  })
  nameKh: string;

  @Column({
    name: "created_by_user_id",
    type: "integer",
    nullable: false,
  })
  createdByUserId: number;


  constructor(partial?: Partial<CategoryEntity>) {
    super();
    Object.assign(this, partial);
  }
}
