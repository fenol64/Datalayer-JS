import mysql from "serverless-mysql";

class Connect {

  constructor(driver, host, port = 3306, user, pass, database) {
    const $return = {};
    $return.success = false;
    const con_params = {
      driver: driver || process.env.DRIVER,
      host: host || process.env.HOST,
      port: port || process.env.PORT,
      user: user || process.env.USER,
      pass: pass || process.env.PASSWORD,
      database: database || process.env.DATABASE,
    };

    if (
      !(
        con_params.driver &&
        con_params.host &&
        con_params.user &&
        con_params.pass &&
        con_params.database
      )
    ) {
      $return.message =
        "[Error] => Dados não informados olhe seu .env ou os parametros";
    } else {
      this.params = {
        driver: con_params.driver,
        host: con_params.host,
        port: con_params.port,
        user: con_params.user,
        password: con_params.pass,
        database: con_params.database,
      };

      const connect_to_driver = this[this.params.driver]();

      if (connect_to_driver.success) {
        $return.success = true;
        $return.message = "[message] => banco conectado com sucesso!";
      } else {
        $return.message = "[erro] => Não foi possivel conectar ao banco.";
      }
    }

    return $return;
  }

  async mysql() {
    const $return = {};

    try {
      $return.success = true;
      this.db = mysql({ config: this.params });
    } catch (err) {
      $return.success = false;
      this.error = err;
    }

    return { data: this , ...$return};
  }

  static getError() {
    return this.error;
  }
}

const conn = new Connect(
  "mysql",
  "localhost",
  3306,
  "root",
  "!sec@1234",
  "pdv"
);
console.log(conn);
if (conn.success) {
  const results = conn.db.query("SELECT * FROM categories");
  console.log(results);
} else {
  console.log(Connect.getError());
}
