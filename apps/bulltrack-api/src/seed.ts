import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { databaseConfig } from './config/database.config';
import { Bull } from './modules/bulls/entities/bull.entity';
import { Favorite } from './modules/favorites/entities/favorite.entity';
import { User } from './modules/users/entities/user.entity';

type SeedBull = Omit<Bull, 'id' | 'favorites'>;

const seedBulls: SeedBull[] = [
  {
    caravana: '992',
    nombre: 'Toro Black Emerald',
    uso: 'vaquillona' as const,
    origen: 'propio' as const,
    pelaje: 'negro' as const,
    raza: 'Angus',
    edadMeses: 36,
    caracteristicaDestacada: 'Top 1% calving ease',
    stats: {
      crecimiento: 85,
      facilidad_parto: 98,
      reproduccion: 75,
      moderacion: 60,
      carcasa: 82,
    },
  },
  {
    caravana: '845',
    nombre: 'Red Diamond',
    uso: 'vaca' as const,
    origen: 'catalogo' as const,
    pelaje: 'colorado' as const,
    raza: 'Angus',
    edadMeses: 42,
    caracteristicaDestacada: 'Top 5% carcass',
    stats: {
      crecimiento: 90,
      facilidad_parto: 40,
      reproduccion: 88,
      moderacion: 70,
      carcasa: 95,
    },
  },
  {
    caravana: '102',
    nombre: 'General 102',
    uso: 'vaquillona' as const,
    origen: 'catalogo' as const,
    pelaje: 'negro' as const,
    raza: 'Brangus',
    edadMeses: 30,
    caracteristicaDestacada: null,
    stats: {
      crecimiento: 70,
      facilidad_parto: 92,
      reproduccion: 65,
      moderacion: 80,
      carcasa: 60,
    },
  },
  {
    caravana: '554',
    nombre: 'Indomable',
    uso: 'vaca' as const,
    origen: 'propio' as const,
    pelaje: 'colorado' as const,
    raza: 'Hereford',
    edadMeses: 48,
    caracteristicaDestacada: null,
    stats: {
      crecimiento: 60,
      facilidad_parto: 30,
      reproduccion: 95,
      moderacion: 50,
      carcasa: 75,
    },
  },
  {
    caravana: '210',
    nombre: 'Midnight Express',
    uso: 'vaquillona' as const,
    origen: 'propio' as const,
    pelaje: 'negro' as const,
    raza: 'Angus',
    edadMeses: 28,
    caracteristicaDestacada: 'Efficiency Leader',
    stats: {
      crecimiento: 78,
      facilidad_parto: 95,
      reproduccion: 82,
      moderacion: 85,
      carcasa: 68,
    },
  },
  {
    caravana: '773',
    nombre: 'Rustic King',
    uso: 'vaca' as const,
    origen: 'catalogo' as const,
    pelaje: 'colorado' as const,
    raza: 'Braford',
    edadMeses: 54,
    caracteristicaDestacada: 'Heat Tolerant',
    stats: {
      crecimiento: 92,
      facilidad_parto: 35,
      reproduccion: 90,
      moderacion: 45,
      carcasa: 88,
    },
  },
  {
    caravana: '304',
    nombre: 'Shadow Warrior',
    uso: 'vaquillona' as const,
    origen: 'propio' as const,
    pelaje: 'negro' as const,
    raza: 'Brangus',
    edadMeses: 32,
    caracteristicaDestacada: 'Performance Pro',
    stats: {
      crecimiento: 88,
      facilidad_parto: 85,
      reproduccion: 70,
      moderacion: 65,
      carcasa: 91,
    },
  },
];

async function run() {
  const dataSource = new DataSource({
    ...databaseConfig,
    entities: [User, Bull, Favorite],
    migrations: [],
    synchronize: false,
  });

  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const bullRepo = dataSource.getRepository(Bull);

  const existingUser = await userRepo.findOne({
    where: { email: 'admin@seed28.com' },
  });
  if (!existingUser) {
    const hash = await bcrypt.hash('seed28', 10);
    await userRepo.insert({
      email: 'admin@seed28.com',
      passwordHash: hash,
    });
    console.log('Created default user: admin@seed28.com / seed28');
  } else {
    console.log('Default user already exists');
  }

  for (const b of seedBulls) {
    const exists = await bullRepo.findOne({ where: { caravana: b.caravana } });
    if (!exists) {
      await bullRepo.insert(b);
      console.log('Inserted bull:', b.nombre);
    }
  }
  console.log('Seed complete.');
  await dataSource.destroy();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
