[![Maintainer](http://img.shields.io/badge/maintainer-NOX%E2%80%930202-blue.svg?style=flat-square)](https://www.instagram.com/phat_oliveira/)
[![Source Code](http://img.shields.io/badge/source-db%E2%80%93datalayer%E2%80%93js-blue.svg?style=flat-square)](https://github.com/NOX-0202/Datalayer-JS)
![Latest Version](http://img.shields.io/badge/version-v0.0.1-blue.svg?style=flat-square)
[![Software License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

# Datalayer-JS
The datalayer-js is a persistent abstraction component of your database that serverless-mysql has prepared instructions for performing common routines such as registering, reading, editing, and removing data.

O datalayer-js é um componente para abstração de persistência no seu banco de dados que usa serverless-mysql com prepared statements para executar rotinas comuns como cadastrar, ler, editar e remover dados.

# Highlights
- Easy to set up (Fácil de configurar)
- Total CRUD asbtration (Asbtração total do CRUD)
- Create safe models (Crie de modelos seguros)

# INSTALLATION AND USAGE
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
  
  This is a select from your database

  ```javascript
    await user.find().fetch() // same: SELECT * FROM users
  ```

  example with all params
  ```javascript
  await user.find({ 
    entity_nickname: "user",
    columns: ["user.username", "users_roles.name as role"],
    joins: [{
      type: "left",
      table: "users_roles",
      conditions: ["user.role_id = users_roles.id"]
    }],
    where: [
      "user.username = 'teste'"
    ],
    limit: 1,
    group_by: "user.id",
    order_by: "user.id"
  }).fetch(true)
  ```

- **findById**
	```javascript
	await user.findById(7).
	```
- **create**
	```javascript
		user.create({
			name:  "value",
		}).save()
	```
- **update**
	```javascript
		user.update({
			name:  "value",
		}).save()
	```
- **delete**
	```javascript
		let current_user = user.findById(4);
		current_user.destroy()
	```


# CONTRIBUTE

 you can do it just make a pull request, I'll be happy :,)
