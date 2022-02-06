import DataLayer  from "./src/DataLayer.js";

class User extends DataLayer {
  constructor() {
      // entity, required, primary and timestamps
      super("users_roles", [], "id", true)
  }
}


//await user.find({ 
//   entity_nickname: "user",
//   columns: ["user.username", "users_roles.name as role"],
//   joins: [{
//     type: "left",
//     table: "users_roles",
//     conditions: ["user.role_id = users_roles.id"]
//   }]
// }).fetch(true)

// user.create({
//   name: "teste",
//   sector: 'testr',
//   active: 1
// })

const user = await  new User().update({
  id: 4,
  name: "teste222",
  sector: 'testr345',
  active: 1
})

console.log(user)








