(function (mysql) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var mysql__default = /*#__PURE__*/_interopDefaultLegacy(mysql);

  class Connect {

    constructor(driver, params = {}, options = {}) {

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

        if (!connect_to_driver) {
          this.success = false;
          this.message = "[erro] => Não foi possível conectar ao banco.";
        } else {
          this.success = true;
          this.message = "[message] => banco conectado com sucesso!";
        }
      }
      return this;
    }

    async mysql(params) {
      let success = false; 

      if (this.db = mysql__default["default"]({ config: params })) {
        success = true;
      }

      return success;
    }

    async exec() {
      this.success = false;
      try {
        this.data = await this.db.query(this.sql);
        this.success = true;
      } catch (err) {
        let error = err; 
        this.error = error; 
      }
      this.close();
      delete this.db;
      return this;
    }

    getError () {
      return this.error;
    }

    async close() {
      if (this.db.quit()) {
        return true;  
      } else {
        return false;
      }
       
    }
  }

  class DataLayer extends Connect {

    constructor(entity, required = [], primary = "id", timestamps = true) {

      super();

      this.entity = entity;
      this.required = required;
      this.primary = primary;
      this.timestamps = timestamps;

      return this;
    }
    
    treatValue(value) {
      if(value === null || value.toString() === 'NULL') return 'NULL';
      else if(typeof value === 'number') return value;
      else if(typeof value === 'boolean') return value ? 1 : 0;
      else return `'${value}'`;
    }

    create(data) {
      var columns = [];
      var values = [];
        
      if(Array.isArray(data)) {
        columns = Object.keys(data[0]);

        data.forEach((obj, index) => {
          const row = Object.values(obj);
          if(row.length !== columns.length) throw new Error("Data and columns don't match in the row "+(index+1));
          values.push(`(${row.map(value => this.treatValue(value)).join(',')})`);
        });
        
      } else if (typeof data === "object") {
        columns = Object.keys(data);
        values.push(`(${Object.values(data).map(value => this.treatValue(value)).join(',')})`);
      }
      
      this.sql = `INSERT INTO ${this.entity} (\`${columns.join('`, `')}\`) VALUES ${values.join(', ')}`;
      return this;
    }

    update(update_obj, where = null) {
      if (this.timestamps) 
        update_obj.updated_at = new Date().toISOString().replace('T', " ").split('.')[0];
      
      let id = update_obj[this.primary];
      delete update_obj[this.primary];

      this.sql = `UPDATE ${this.entity} SET ${Object.entries(update_obj).map(([key, value]) => `${key}='${value}'`)} WHERE ${this.primary} = ${id} ${where ?? ""}`;

      return this;
    } 

    find(params = {}) {
      
      const {columns = [], joins, where, entity_nickname, limit, group_by, order_by} = params ;

      this.sql = `SELECT ${columns.length > 0 ?columns.join(', ') : '*'} FROM ${this.entity} ${entity_nickname ? `AS ${entity_nickname} `: ''}`;

      if (params.joins) {
        joins.forEach(join => {
          switch (join.type) {

            case 'inner':
              join.type = "INNER JOIN";
              break;
    
            case 'left':
              join.type = "LEFT JOIN";
              break;
    
            case 'right':
              join.type = "RIGHT JOIN";
              break;
    
          }
          this.sql += `${join.type} ${join.table} ON ${join.conditions.join(', ')}`;
        });
      }

      if (params.where) {
        this.sql += ' WHERE ';
        params.where.map(clause => this.sql += clause);
      }


      if (group_by) {
        this.sql += ` GROUP BY ${group_by} `;
      }

      if (order_by) {
        this.sql += ` ORDER BY ${order_by}`; 
      }

      if (limit) {
        this.sql += ` LIMIT ${limit} `;
      }


      return this;
    }

    async findById(id) {

      this.data = await this.find({ where: [
            `${this.primary} = ${id}`
        ]}).fetch();

      return this;
    }

    async destroy(exclude = false) {

      const id = this.data[0].id;

      if (exclude) 
        this.delete(id);
      else 
        await this.update({
          id,
          deleted_at: new Date().toISOString().replace('T', " ").split('.')[0]
        }).save();
        return this;
    }

    async delete (id) {
      this.sql = `DELETE FROM ${this.entity} WHERE ${this.primary} = ${id}`;
      this.data = await super.exec();
      return this;
    }

    async fetch(all = false) {
      
      let data = await super.exec();
      if (all) return data
      else return data.data
    }

    async save() {
      await super.exec();
      return this;
    }


    fail() {
      return super.getError()
    }

  }

  return DataLayer;

})(mysql);
