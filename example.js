import DataLayer  from "./src/DataLayer.js";

class User extends DataLayer {
  constructor() {
      // entity, required, primary and timestamps
      super("users", [], "id", true)
  }
}

const user = await new User().find().fetch();

console.log(user)








