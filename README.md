# Datalayer-JS

The datalayer-js is a persistent abstraction component of your database that PDO has prepared instructions for performing common routines such as registering, reading, editing, and removing data.

O datalayer-js é um componente para abstração de persistência no seu banco de dados que usa PDO com prepared statements para executar rotinas comuns como cadastrar, ler, editar e remover dados.

# Highlights
- Easy to set up (Fácil de configurar)
- Total CRUD asbtration (Asbtração total do CRUD)
- Create safe models (Crie de modelos seguros)

# INSTALATION AND USAGE
DataLayer-js is available via NPM: 

```
  npm i datalayerjs
```

on the root of the project create a `` .env  `` file with the following contents.
```.env
  DRIVER = mysql
  HOST = <YOUR HOST>
  PORT = 3306
  USER = <YOUR USER>
  PASSWORD = <YOUR PASS>
  DATABASE = <YOUR DATABASE>
```
then you create a folder named models, create a model like this:

```javascript
  import DataLayer  from "./src/DataLayer.js";

  class User extends DataLayer {
    constructor() {
        // entity, required, primary and timestamps
        super("users", [], "id", true)
    }
  }
```
Now you are ready to use the datalayer function :D

# DOCS

- **find**

  ```
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
  ```

- **findById**
- **create**
- **update**
- **delete**
