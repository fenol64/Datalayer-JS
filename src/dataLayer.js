import Connect from "./Connect.js";
import CrudTrait from "./CrudTrait.js";

export class dataLayer extends CrudTrait {
  conn = null;

  constructor(entity, required, primary = "id", timestamps = true) {
    this.entity = entity;
    this.required = required;
    this.primary = primary;
    this.timestamps = timestamps;
  }

  save() {

  }

  find() {

  }

  update() {

  } 

  destroy() {

  }

  delete () {

  }

}




//   Connect() {
//     this.conn = new Connect("mysql", {
//       pass: "!sec@1234",
//       database: "sci",
//     });

//     return this;
//   }