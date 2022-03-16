const  Connect = require("./src/Connect.js")
require('dotenv').config()
class DataLayer extends Connect {

  constructor(entity, required = [], primary = "id", timestamps = true) {

    super()

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
    
    let id = update_obj[this.primary]
    delete update_obj[this.primary]

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
            join.type = "INNER JOIN"
            break;
  
          case 'left':
            join.type = "LEFT JOIN"
            break;
  
          case 'right':
            join.type = "RIGHT JOIN"
            break;
  
        }
        this.sql += `${join.type} ${join.table} ON ${join.conditions.join(', ')}`
      })
    }

    if (params.where) {
      this.sql += ' WHERE '
      params.where.map(clause => this.sql += clause)
    }


    if (group_by) {
      this.sql += ` GROUP BY ${group_by} `
    }

    if (order_by) {
      this.sql += ` ORDER BY ${order_by}` 
    }

    if (limit) {
      this.sql += ` LIMIT ${limit} `
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

    const id = this.data[0].id

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
    this.data = await super.exec()
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

module.exports = DataLayer;
