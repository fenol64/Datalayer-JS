import DataLayer  from "./src/DataLayer.js";

class User extends DataLayer {
  constructor() {
      // entity, required, primary and timestamps
      super("users", [], "id", true)
  }
}

let user  = new User().find()

const user = (new User())

// const select_users = await user.find().fetch()

await user.find({ 
  entity_nickname: "user",
  columns: ["user.username", "users_roles.name as role"],
  joins: [{
    type: "left",
    table: "users_roles",
    conditions: ["user.role_id = users_roles.id"]
  }],
  limit: 1,
  group_by: "user.id",
  order_by: "user.id"
}).fetch(true)


// user.create({
//   name: "teste",
//   sector: 'teste',
//   active: 1
// }).save()

// await user.update({
//   id: 4,
//   name: "testador",
//   sector: 'teste',
//   active: 1
// }).save()


// let findUsers = await user.findById(7)
// await findUsers.destroy()


if (user.fail()) {
  console.log(user.fail())
}

console.log(user)








