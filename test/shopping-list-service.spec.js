const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping list service object`, function () {
    let db
    let testItems = [
        {
            id: 1,
            name: 'apple', 
            price: 1.00, 
            category: 'Snack', 
            checked: false, 
            date_added: new Date('2020-11-22T16:28:32.615Z')
        },
        {
            id: 2,
            name: 'bacon', 
            price: 4.50, 
            category: 'Breakfast', 
            checked: true, 
            date_added: new Date('2020-12-01T16:28:32.615Z')
        },
        {
            id: 3,
            name: 'sandwich', 
            price: 6.75, 
            category: 'Lunch', 
            checked: false, 
            date_added: new Date('2020-12-02T16:28:32.615Z')
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })
        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllitems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })
        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        category: thirdTestItem.category,
                        checked: thirdTestItem.checked,
                        date_added: thirdTestItem.date_added
                    })
                })
        })
        it(`deleteitem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteitem(db, itemId)
                .then(() => ShoppingListService.getAllitems(db))
                .then(allitems => {
                    const expected = testItems.filter(item => item.id !== itemId)
                    expect(allitems).to.eql(expected)
                })
        })
        it(`updateitem() updates an item from the 'shopping_list' table`, () => {
            const idOfitemToUpdate = 3
            const newitemData = {
                name: 'updated name',
                price: 2.99,
                category: 'Snack',
                checked: false,
                date_added: new Date(),
            }
            return ShoppingListService.updateitem(db, idOfitemToUpdate, newitemData)
                .then(() => ShoppingListService.getById(db, idOfitemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfitemToUpdate,
                        ...newitemData,
                    })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllitems() resolves an empty array`, () => {
            return ShoppingListService.getAllitems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
        it(`insertitem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newitem = {
                name: 'Test new name',
                price: 'Test new price',
                category: 'Lunch',
                checked: false,
                date_added: new Date('2020-01-01T00:00:00.000Z'),
            }
            return ShoppingListService.insertitem(db, newitem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newitem.name,
                        price: newitem.price,
                        category: newitem.category,
                        checked: newitem.checked,
                        date_added: newitem.date_added,
                    })
                })
        })
    })
})