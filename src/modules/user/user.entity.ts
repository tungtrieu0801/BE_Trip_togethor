import { Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";

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

    @Column({ type: 'varchar', length: 50, nullable: true })
    phoneNumber: string;

    @Column({ type: 'boolean', default: false })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastLogin: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    role: string;

    @Column({ type: 'boolean', default: false })
    isEmailVerified: boolean;

    @Column({ type: 'boolean', default: false })
    isPhoneNumberVerified: boolean;
    
}