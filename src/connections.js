const  mysql = require("serverless-mysql");

class Connect {

  constructor(driver, host, port = 3306, user, pass = "", database, options = {}) {
    this.success = false;

    const con_params = {
      driver: process.env.DRIVER || driver,
      host: process.env.HOST || host,
      port: process.env.PORT || port,
      user: process.env.USER || user,
      pass: process.env.USER || pass,
      database: process.env.DATABASE || database,
      options
    };

    if (
      !(
        con_params.driver &&
        con_params.host &&
        con_params.user &&
        con_params.database
      )
    ) {
      this.message = "[Error] => Dados não informados olhe seu .env e/ou os parametros";
    } else {

      const connect_to_driver = this[con_params.driver](con_params);
      if (connect_to_driver.success) {
        this.db = mysql;
        this.success = true;
        this.message = "[message] => banco conectado com sucesso!";
        
      } else {
        this.message = "[erro] => Não foi possivel conectar ao banco.";
      }
    }

    return this;
  }

  async mysql(params) {
    const $return = {};

    try {

      this.db = mysql({ config: params });
      $return.success = true;

    } catch (err) {
      $return.success = false;
      this.error = err;
    }
  
    return $return;
  }


  async end() {
    return await mysql.end();
  }
}

(async function test() {
  
  const conn = new Connect("mysql", "localhost", 3306, "root", "", "pmp");

  console.log(await conn.db.query("select * FROM usuarios"));
}) ()

