import { Review } from '../review/review.entity';
import { VinylRecord } from '../vinyl-record/vinyl-record.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from './roles.enum';
import { Exclude, Transform } from 'class-transformer';
import { Image } from '../image/image.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true, type: 'date' })
  birthDate: Date | null;

  @Transform(({ value }) => value.id)
  @OneToOne(() => Image, { onDelete: 'CASCADE' })
  @JoinColumn()
  avatar: Image;

  @Exclude()
  @Column({ type: 'enum', enum: Roles, default: Roles.User })
  role: Roles;

  @OneToMany(() => Review, (review) => review.author, { onDelete: 'CASCADE' })
  reviews: Review[];

  @ManyToMany(() => VinylRecord, { onDelete: 'CASCADE' })
  @JoinTable()
  purchases: VinylRecord[];
}
