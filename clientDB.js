const { Client } = require("pg");

const cli = new Client({
    user: "postgres",
    host: "localhost",
    database: "latihan_nodeSQL",
    password: "100310",
    port: 5432
});

cli.connect();

module.exports = cli;
