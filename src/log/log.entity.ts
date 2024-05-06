import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Actions } from './actions.enum';
import { ObjectTypes } from './object-types.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class Log {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Actions })
  action: Actions;

  @Column({ nullable: true, type: 'uuid' })
  userId: string | null;

  @Column({ type: 'enum', enum: ObjectTypes })
  objectType: ObjectTypes;

  @Column({ type: 'uuid' })
  objectId: string;

  @CreateDateColumn()
  timestamp: Date;
}
