import { config } from 'dotenv';

config();

export interface Env {
  NODE_ENV: string;
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  CORS_ORIGIN: string;
}

const required: (keyof Env)[] = ['JWT_SECRET'];

function getEnv(key: string): string | undefined {
  const v = process.env[key];
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined;
}

export function validateEnv(): Env {
  const errors: string[] = [];

  for (const key of required) {
    if (!getEnv(key)) {
      errors.push(`Missing required env: ${key}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Env validation failed:\n${errors.join('\n')}`);
  }

  const portRaw = getEnv('PORT') ?? '3001';
  const port = parseInt(portRaw, 10);
  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid env: PORT must be 1-65535, got "${portRaw}"`);
  }

  const dbPortRaw = getEnv('DB_PORT') ?? '5432';
  const dbPort = parseInt(dbPortRaw, 10);
  if (Number.isNaN(dbPort) || dbPort < 1 || dbPort > 65535) {
    throw new Error(`Invalid env: DB_PORT must be 1-65535, got "${dbPortRaw}"`);
  }

  return {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    PORT: port,
    JWT_SECRET: getEnv('JWT_SECRET')!,
    JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN') ?? '1d',
    JWT_REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN') ?? '7d',
    DB_HOST: getEnv('DB_HOST') ?? 'localhost',
    DB_PORT: dbPort,
    DB_USERNAME: getEnv('DB_USERNAME') ?? 'postgres',
    DB_PASSWORD: getEnv('DB_PASSWORD') ?? 'postgres',
    DB_DATABASE: getEnv('DB_DATABASE') ?? 'bulltrack',
    CORS_ORIGIN: getEnv('CORS_ORIGIN') ?? 'http://localhost:3000',
  };
}
