require('dotenv').config();
const path = require('path');

async function main() {
  const configPath = path.join(__dirname, '../dist/config/database.config.js');
  const { databaseConfig } = require(configPath);
  const { DataSource } = require('typeorm');

  const ds = new DataSource(databaseConfig);
  await ds.initialize();

  const migrations = [
    [1738785600000, 'InitialSchema1738785600000'],
    [1738850000000, 'AddIndexes1738850000000'],
  ];

  for (const [ts, name] of migrations) {
    const exists = await ds.query(
      `SELECT 1 FROM migrations WHERE "name" = $1 LIMIT 1`,
      [name],
    );
    if (exists.length > 0) continue;
    await ds.query(
      `INSERT INTO migrations ("timestamp", "name") VALUES ($1, $2)`,
      [ts, name],
    );
  }

  await ds.destroy();
  console.log('Synced migration history. Run: pnpm run migration:run');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
