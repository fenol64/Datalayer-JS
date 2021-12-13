import Connect from "./Connect.js";

export class dataLayer {
  conn = null;

  constructor(entity, required, primary = "id", timestamps = true) {
    this.entity = entity;
    this.required = required;
    this.primary = primary;
    this.timestamps = timestamps;
  }

  Connect() {
    this.conn = new Connect("mysql", {
      pass: "!sec@1234",
      database: "sci",
    });

    return this;
  }
}
