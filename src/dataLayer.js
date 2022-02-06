import Connect from "./Connect.js";
import CrudTrait from "./CrudTrait.js";
import 'dotenv/config'

export default class DataLayer extends Connect {

  constructor(entity, required = [], primary = "id", timestamps = true) {

    super("mysql")

    this.entity = entity;
    this.required = required;
    this.primary = primary;
    this.timestamps = timestamps;

    return this;
  }

  save(input_insert) {
    this.sql = `INSERT INTO ${this.entity} (${Object.keys(input_insert).join(', ')}) VALUES (${Object.values(input_insert).join(', ')})`;
    return this;
  }

  find(params) {
    const { join, where } = params;

    this.sql = `SELECT ${params.columns.join(', ') ?? '*'} FROM ${this.entity} `;

    if (join) {

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
      this.sql += `${join.type} ${join.table} ON ${join.condition}`

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


  update() {

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
