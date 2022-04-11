import { db } from './db.js'
import {saveFile} from './util.js'
import {validateOrderSchema} from '../schemas/orderSchema.js'

export async function getOrders(username){
    let sql = `SELECT * FROM orders WHERE receivedStatusYN = "No" ORDER BY receivedStatusYN ASC;`
    const result = await db.query(sql)
    for(let i = 0; i < result.length; i++) {
        const order = result[i]
        sql = `SELECT * FROM stock WHERE id = ${order.itemId};`
        const items = await db.query(sql)
        order.item = items[0]
    }
    console.log(result)
    return result
}


//to add a new order on the restock page
export async function addOrder(data) {
    data.receivedStatusYN = false
    data.itemId = parseInt(data.itemId)
    data.quantity = parseInt(data.quantity)
    const validationCheck =validateOrderSchema(data)
    console.log(validationCheck, data)
    if (validationCheck ===false) throw new Error("Data invalid through schema")
    const sql = `INSERT INTO orders(itemId, quantity, receivedStatusYN) VALUES (${data.itemId}, ${data.quantity}, ${data.receivedStatusYN});`
    await db.query(sql)
}


export async function updateReceived(id) {
    console.log(id)
    let sql = `UPDATE orders SET receivedStatusYN = TRUE WHERE id = ${id};`
    await db.query(sql)
    sql = `SELECT * FROM orders WHERE id = ${id};`
    const result = await db.query(sql)
    const order = result[0]
    console.log(order)
    sql = `SELECT * FROM stock WHERE id = ${order.itemId};`
    const items = await db.query(sql)
    order.item = items[0]
    sql = `UPDATE stock 
           SET 
              quantity = quantity + ${order.quantity},
              stockLevel = CASE WHEN quantity >= 5 THEN "High" ELSE "Low" END
           WHERE id = ${order.item.id};`
    await db.query(sql)
}
