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
    
    const {columns = [], joins, where, entity_nickname, limit, group_by, order_by} = params ;

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
