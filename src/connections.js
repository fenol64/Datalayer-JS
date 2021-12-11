import mysql from "serverless-mysql";

class Connect {

  constructor(driver, params, options = {}) {
    this.success = false;

    const con_params = {
      driver: process.env.DRIVER || driver,
      host: process.env.HOST || (params.host ?? "localhost"),
      port: process.env.PORT || (params.port ?? 3306),
      user: process.env.USER || (params.user ?? "root"),
      pass: process.env.USER || (params.pass ?? ""),
      database: process.env.DATABASE || params.database,
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
      
      if (!connect_to_driver.error) {
        this.success = true;
        this.message = "[message] => banco conectado com sucesso!";
      } else {
        this.message = "[erro] => Não foi possivel conectar ao banco.";
      }
    }
    return this;
  }

  async mysql(params) {
    this.error = null;
    
    if (this.db = mysql({ config: params })) 
      this.error = false;
     
    return this;
  }

  async exec(querysrt) {

    if (this.success) {
      try {
        this.data = await this.db.query(querysrt);
        this.close();
      } catch (err) {
        this.error = err; 
      }

    }
  
    return this;
  }

  async close() {
    if (this.db.end()) {
      return true;  
    } else {
      return false;
    }
     
  }
}

(async function test() {
  
  const conn = await new Connect("mysql", {
    pass: "",
    database: "pmp"
  }).exec("SELECT * FROM usuarios");

  console.log(conn.data);
}) ()

