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

    let joins = ''
    let where = ''

    this.sql = `SELECT ${this.columns ?? '*'} FROM ${this.entity} ${joins} ${where};`;
    return this;
  }

  findById(id) {
    this.user_id = id;

    this.sql = `SELECT ${this.columns ?? '*'} FROM ${this.entity} ${this.joins} WHERE ${this.primary} = ${id}`;
    return this;
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
