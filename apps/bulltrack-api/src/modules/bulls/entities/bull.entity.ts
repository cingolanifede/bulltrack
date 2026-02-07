import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Favorite } from '../../favorites/entities/favorite.entity';

export type OrigenType = 'propio' | 'catalogo';
export type PelajeType = 'negro' | 'colorado';
export type UsoType = 'vaquillona' | 'vaca';

@Entity('bulls')
export class Bull {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  caravana: string;

  @Column()
  nombre: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  uso: UsoType;

  @Column({
    type: 'varchar',
    length: 20,
  })
  origen: OrigenType;

  @Column({
    type: 'varchar',
    length: 20,
  })
  pelaje: PelajeType;

  @Column()
  raza: string;

  @Column({ name: 'edad_meses', type: 'int' })
  edadMeses: number;

  @Column({ name: 'caracteristica_destacada', type: 'varchar', nullable: true })
  caracteristicaDestacada: string | null;

  @Column({ type: 'jsonb' })
  stats: {
    crecimiento: number;
    facilidad_parto: number;
    reproduccion: number;
    moderacion: number;
    carcasa: number;
  };

  @Column({
    name: 'bull_score',
    type: 'numeric',
    precision: 6,
    scale: 2,
    insert: false,
    update: false,
    nullable: true,
  })
  bullScore?: number;

  @OneToMany(() => Favorite, (f) => f.bull)
  favorites: Favorite[];
}
