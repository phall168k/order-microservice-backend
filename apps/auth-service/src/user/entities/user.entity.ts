import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "../../role/entities/role.entity";
import { BaseEntity } from "@app/database/entities/base.entity";

@Entity({
    name: 'users',
})
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'username',
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: false,
    })
    username: string;

    @Column({
        name: 'email',
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: false,
    })
    email: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    password: string;

    @Column({
        name: 'is_admin',
        type: 'boolean',
        default: false,
    })
    isAdmin: boolean;

    @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        }
    })
    roles: Promise<RoleEntity[]>;


    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
    })
    isActive: boolean;

    @Column({
        name: 'created_by_user_id',
        type: 'integer',
        nullable: true,
    })
    createdByUserId: number;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({
        name: 'created_by_user_id',
    })
    createdByUser: UserEntity;
    
    constructor(partial?: Partial<UserEntity>) {
        super();
        Object.assign(this, partial);
    }
}
