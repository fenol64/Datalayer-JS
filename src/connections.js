const  mysql = require("serverless-mysql")();

class Connect {

  constructor(driver, host, port = 3306, user, pass = "", database, options = {}) {
    const $return = {};
    $return.success = false;

    const con_params = {
      driver: process.env.DRIVER || driver,
      host: process.env.HOST || host,
      port: process.env.PORT || port,
      user: process.env.USER || user,
      pass: process.env.USER || pass,
      database: process.env.DATABASE || database,
      options: options
    };

    if (
      !(
        con_params.driver &&
        con_params.host &&
        con_params.user &&
        con_params.database
      )
    ) {
      $return.message = "[Error] => Dados não informados olhe seu .env e/ou os parametros";
    } else {
      this.params = {
        host: con_params.host,
        port: con_params.port,
        user: con_params.user,
        password: con_params.pass,
        database: con_params.database,
        options: con_params.options,
      };

      const connect_to_driver = this[con_params.driver]();
      if (connect_to_driver.success) {
        $return.success = true;
        $return.message = "[message] => banco conectado com sucesso!";
        
      } else {
        $return.message = "[erro] => Não foi possivel conectar ao banco.";
      }
      $return.db = connect_to_driver;
    }

    return $return;
  }

  async mysql() {
    const $return = {};
   
    mysql.config(this.params);
    await mysql.connect()

    const connection = mysql.getClient();

    if (connection.state === "authenticated") {
      this.db = mysql;
      $return.success = true;
      $return.db = mysql;
    } else {
      $return.success = false;
    }

    return $return;
  }

  end() {
    return mysql.end();
  }
}






