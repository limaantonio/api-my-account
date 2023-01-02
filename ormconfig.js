
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
   username: process.env.USERNAME,
   password:process.env.PASSWORD,
   database: process.env.DATABSE,
   migrations: ["./src/database/migrations/*.ts"],
   entities: ["./src/entities/*.ts"],
   cli: {
     migrationsDir: "./src/database/migrations",
   },
 };