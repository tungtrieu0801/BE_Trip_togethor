import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Role } from "../role/role.entity";

@Entity('users')
export class User { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 20, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 100 })
    password: string;

    @Column({name: 'phone_number' ,type: 'varchar', length: 50, nullable: true })
    phoneNumber: string;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'last_login', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    lastLogin: Date;

    @Column({ name: 'is_email_verified', type: 'boolean', default: false })
    isEmailVerified: boolean;

    @Column({ name: 'is_phone_number_verified', type: 'boolean', default: false })
    isPhoneNumberVerified: boolean;
    
    @ManyToMany(() => Role, (role) => role.users, { eager: true })
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[];
}