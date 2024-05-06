import { Exclude, Expose, Transform } from 'class-transformer';
import { Review } from '../review/review.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../image/image.entity';

@Entity()
export class VinylRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  authorName: string;

  @Column()
  description: string;

  @Column({ type: 'real' })
  price: number;

  @Transform(({ value }) => value.id)
  @OneToOne(() => Image, { onDelete: 'CASCADE' })
  @JoinColumn()
  image: Image;

  @OneToMany(() => Review, (review) => review.vinylRecord, {
    onDelete: 'CASCADE',
  })
  reviews: Review[];

  @Exclude({ toPlainOnly: true })
  userId?: string;
}
