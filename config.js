module.exports = {
  db: {
    connectionString: "mongodb://localhost:27017/LibraryDB",
  },
  server: {
    port: 3000,
  },
  security: {
    saltRounds: 10,
    jwtSecret: process.env.JWT_SECRET || "supersecretkey",
  },
};
