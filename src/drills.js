require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

console.log('knex and driver installed correctly')

//Drill 1
function searchByItemName(searchTerm) {
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

//searchByItemName('Fish')

//Drill 2
function paginateItems(page) {
    const productsPerPage = 6
    const offset = (page - 1) * productsPerPage
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

//paginateItems(3)

//Drill 3
function searchItemsByDaysAgo(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
        .then(result => {
            console.log(result)
        })
}

//searchItemsByDaysAgo(10)
//Drill 4
function totalCostPerCategory() {
    knexInstance
        .select('category')
        .sum('price AS total_cost')
        .groupBy('category')
        .from('shopping_list')
        .then(result => {
            console.log(result)
        })
}

totalCostPerCategory()