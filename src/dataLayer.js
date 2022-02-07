import Connect from "./Connect.js";
import 'dotenv/config'

export default class DataLayer extends Connect {

  constructor(entity, required = [], primary = "id", timestamps = true) {

    super()

    this.entity = entity;
    this.required = required;
    this.primary = primary;
    this.timestamps = timestamps;

    return this;
  }

  save() {
    return super.exec();
  }

  create(insert_obj) {

    if (this.timestamps) 
      insert_obj.created_at = new Date().toISOString().replace('T', " ").split('.')[0];
    
    this.sql = `INSERT INTO ${this.entity} (${Object.keys(insert_obj).join(', ')}) VALUES (${Object.values(insert_obj).map(value => `'${value}'`)})`;

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
    
    const {columns = [], joins, where, entity_nickname} = params ;

    this.sql = `SELECT ${columns.length > 0 ?columns.join(', ') : '*'} FROM ${this.entity} ${entity_nickname ? `AS ${entity_nickname} `: ''}`;

    if (joins) {
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

    if (where) {
      this.sql += ' WHERE '
      params.where.map(clause => this.sql += clause)
    }

    return this;
  }

  findById(id) {
    return this.find({ where: [
      `${this.primary} = ${id}`
    ]})
  }

  destroy(destroy = false) {
    if (destroy) 
      this.delete();
    else 
      this.update({
        deleted_at: new Date().toISOString().replace('T', " ").split('.')[0]
      });
      return this;
  }

  delete () {
    this.sql = `DELETE FROM ${this.entity} WHERE ${this.primary} = ${id}`;

    return this;
  }

  async fetch(all = false) {
    this.executed = await super.exec();
    
    if (all) return this
    else return this.executed
  }

  fail() {
    return super.getError()
  }

}
