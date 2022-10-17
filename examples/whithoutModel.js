const DataLayer = require("../")

const connection_params = {
    driver: 'mysql',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'test'
}

const db = new DataLayer(connection_params);



