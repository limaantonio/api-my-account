const dotevnt = require("dotenv");

dotevnt.config({
  path: process.env.NODE_ENV == "dev " ? ".env.dev" : ".env.production",
});

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  migrations: [process.env.TYPEORM_MIGRATION],
  entities: [process.env.TYPEORM_ENTITIES],
  cli: {
    migrationsDir: process.env.TYPEORM_MIGRATION_DIR,
  },
};
