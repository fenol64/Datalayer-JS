import DataLayer  from "./src/DataLayer.js";

class User extends DataLayer {
  constructor() {
      // entity, required, primary and timestamps
      super("users", [], "id", true)
  }
}

const user = await new User().find({ 
  columns: ["users.username", "users_roles.name as role"],
  join: {
    type: "left",
    table: "users_roles",
    condition: "users.role_id = users_roles.id"
  }
}).fetch(true)

console.log(user)








