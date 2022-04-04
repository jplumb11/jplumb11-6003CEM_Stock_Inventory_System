import { db } from './db.js'
import {saveFile} from './util.js'
import {validateOrderSchema} from './schemas/orderSchema.js'

export async function getOrders(username){
    let sql = `SELECT * FROM orders ORDER BY receivedStatusYN ASC;`
    const result = await db.query(sql)
    for(let i = 0; i < result.length; i++) {
        const order = result[i]
        sql = `SELECT * FROM stock WHERE id = ${order.itemId};`
        const items = await db.query(sql)
        order.item = items[0]
    }
	console.log("get low items working")
    return result
}
//to add a new order on the restock page
export async function addOrder(data) {
    const validationCheck =validateOrderSchema(data)
    if (validationCheck ===false) throw new Error("Data invalid through schema")

    data.receivedStatusYN = false
    const sql = `INSERT INTO orders(itemId, quantity, receivedStatusYN) VALUES (${data.itemId}, ${data.quantity}, ${data.receivedStatusYN});`
    await db.query(sql)
}

//to get all items being sent to the received page
export async function getReceivedItems(data){
   let sql = `SELECT * FROM orders WHERE receivedStatusYN = "No";`
    const result = await db.query(sql)
	console.log("get low items working")
    return result
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
