import Connect from "./Connect.js";

export class crudTrait {

    create() {

    }

    update () {

    }

    delete () {
        
    }

    filter(data)
    {
        let filter = data.filter((el, key, value) => {
            return filter[key] = value === null ? null : value
        });

        return filter;
    }
}
