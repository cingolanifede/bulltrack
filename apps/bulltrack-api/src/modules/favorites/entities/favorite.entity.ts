import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Bull } from '../../bulls/entities/bull.entity';
import { User } from '../../users/entities/user.entity';

@Entity('favorites')
export class Favorite {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'bull_id' })
  bullId: number;

  @ManyToOne(() => User, (u) => u.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Bull, (b) => b.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bull_id' })
  bull: Bull;
}
