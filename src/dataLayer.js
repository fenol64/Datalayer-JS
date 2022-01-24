import Connect from "./Connect.js";
import CrudTrait from "./CrudTrait.js";

export default class DataLayer extends Connect {
  conn = null;

  constructor(entity, required = [], primary = "id", timestamps = true) {
    super()
    this.entity = entity;
    this.required = required;
    this.primary = primary;
    this.timestamps = timestamps;

    this.conn = new Connect("mysql");

    return this;
  }

  save(input_insert) {
    this.sql = `INSERT INTO ${this.entity} (${Object.keys(input_insert).join(', ')}) VALUES (${Object.values(input_insert).join(', ')})`;
    return this;
  }

  find() {
    this.sql = `SELECT ${this.columns ?? '*'} FROM ${this.entity} ${this.joins} ${this.where}`;
    return this;
  }

  findById(id) {
    this.sql = `SELECT ${this.columns ?? '*'} FROM ${this.entity} ${this.joins} WHERE ${this.primary} = ${id}`;
    return this;
  }

  update() {

  } 

  destroy(destroy = false) {

  }

  delete () {

  }

}



