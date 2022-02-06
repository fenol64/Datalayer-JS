import mysql from "serverless-mysql";
export default class Connect {

  constructor(driver, params = {}, options = {}) {
    this.success = false;

    const con_params = {
      driver: process.env.DRIVER || driver,
      host: process.env.HOST || (params.host ?? "localhost"),
      port: process.env.PORT || (params.port ?? 3306),
      user: process.env.USER || (params.user ?? "root"),
      password: process.env.PASSWORD || (params.password ?? ""),
      database: process.env.DATABASE || params.database,
    };

    if (
      !(
        con_params.driver &&
        con_params.host &&
        con_params.user &&
        con_params.database
      )
    ) {
      this.message = "[Error] => Dados não informados olhe seu .env e/ou os parâmetros";
    } else {

      const connect_to_driver = this[con_params.driver](con_params);
      
      if (!connect_to_driver.error) {
        this.success = true;
        this.message = "[message] => banco conectado com sucesso!";
      } else {
        this.message = "[erro] => Não foi possível conectar ao banco.";
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

  async exec() {
    if (this.success) {
      try {
        this.data = await this.db.query(this.sql);
        this.close();
      } catch (err) {
        this.error = err; 
      }
    }
    return this;
  }

  async close() {
    if (this.db.quit()) {
      return true;  
    } else {
      return false;
    }
     
  }
}


