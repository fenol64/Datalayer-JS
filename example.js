import DataLayer  from "./src/DataLayer.js";

class User extends DataLayer {
  constructor() {
      // entity, required, primary and timestamps
      super("users_roles", [], "id", true)
  }
}

const user = (new User())


// user.find({ 
//   entity_nickname: "user",
//   columns: ["user.username", "users_roles.name as role"],
//   joins: [{
//     type: "left",
//     table: "users_roles",
//     conditions: ["user.role_id = users_roles.id"]
//   }]
// }).fetch()

// user.create({
//   name: "teste",
//   sector: 'testr',
//   active: 1
// })

user.update({
  id: 4,
  name: "teste2234324222",
  sector: 'testr234223424334345',
  active: 1
}).save()


// console.log(await user.find().fetch())

if (user.fail()) {
  console.log(user.fail())
}

console.log(user)








