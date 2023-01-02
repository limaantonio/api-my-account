
module.exports = {
   type: "postgres",
   url: process.env.DATABASE_URL,
   host: "",
  //ssl: true,
   // extra: {
   //   ssl: {
   //     rejectUnauthorized: false,
   //   },
   // },
   port: 5432,
   username: 'postgres',
   password: 'root',
   database: 'db_my_account',
   migrations: ["./src/database/migrations/*.ts"],
   entities: ["./src/entities/*.ts"],
   cli: {
     migrationsDir: "./src/database/migrations",
   },
 };