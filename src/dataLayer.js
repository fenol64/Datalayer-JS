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

  create(insert_obj) {

    if (this.timestamps) 
      insert_obj.created_at = new Date.now();
    
    this.sql = `INSERT INTO ${this.entity} (${Object.keys(insert_obj).join(', ')}) VALUES (${Object.values(insert_obj).map(value => `'${value}'`)})`;
    super.exec()

    return this;
  }

  update(update_obj, where = null) {
    if (this.timestamps) 
      update_obj.updated_at = new Date.now();
    
    let id = update_obj[this.primary]
    delete update_obj[this.primary]

    this.sql = `UPDATE ${this.entity} SET ${Object.entries(update_obj).map(([key, value]) => `${key}='${value}'`)} WHERE ${this.primary} = ${id} ${where ?? ""}`;
    super.exec()

    return this;
  } 

  find(params) {
    const { joins, where, entity_nickname } = params;

    this.sql = `SELECT ${params.columns.join(', ') ?? '*'} FROM ${this.entity} ${` AS ${entity_nickname} ` ?? ""}`;

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
    ]}).fetch();
  }

  destroy(destroy = false) {

  }

  delete () {

  }

  async fetch(all = false) {
    this.executed = await super.exec();
    if (all) return this
    else return this.data
  }

}
