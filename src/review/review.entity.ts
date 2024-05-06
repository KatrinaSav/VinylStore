import { VinylRecord } from '../vinyl-record/vinyl-record.entity';
import { User } from '../user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @Column({ type: 'int', width: 5 })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @Transform(({ value }) => value.id)
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  author: User;

  @Transform(({ value }) => value.id)
  @ManyToOne(() => VinylRecord, (vinylRecord) => vinylRecord.reviews, {
    onDelete: 'CASCADE',
  })
  vinylRecord: VinylRecord;
}
