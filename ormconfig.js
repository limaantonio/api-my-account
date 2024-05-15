const dotevnt = require("dotenv");

dotevnt.config({
  path: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.production",
});

console.log(process.env.TYPEORM_MIGRATION);
console.log(process.env.TYPEORM_ENTITIES);
console.log(process.env.TYPEORM_MIGRATION_DIR);
console.log(process.env.NODE_ENV);

module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: 'mypass',
  database: "db_my_account",
  migrations: [process.env.TYPEORM_MIGRATION],
  entities: [process.env.TYPEORM_ENTITIES],
  cli: {
    migrationsDir: process.env.TYPEORM_MIGRATION_DIR,
  },
};