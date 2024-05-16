console.log("DATABASE_URL: ", process.env.DATABASE_URL);

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  migrations: ["./dist/src/database/migrations/*.js"],
  entities: ["./dist/src/entities/*.js"],
  cli: {
    migrationsDir: "./dist/src/database/migrations",
   },
};
