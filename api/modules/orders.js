import { db } from './db.js'
import {saveFile} from './util.js'


export async function getOrders(username){
    let sql = `SELECT * FROM orders;`
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


//to update the recieved items 
export async function updateReceived(data){
let sql = `SELECT id FROM accounts WHERE user = "${data.username}"`//maybe change this to the item id 
        let result = await db.query(sql)
        data.userID = result[0].id
        //set the stock level to low if its less than 5
        if(data.quantity <= 5) {
            data.stockLevel = "Low";
        } else {
            data.stockLevel = "High";
        }
        const dCheck = `SELECT count(id) AS count FROM stock WHERE productBarcode = "${data.productBarcode}";`
        const duplicateCheck = await db.query(dCheck)
    
        if(duplicateCheck[0].count) {
            //if duplicate is found update quantity
            const sql = `UPDATE stock SET quantity = quantity  + ${data.quantity}, stockLevel = IF(quantity <= 5, "High", "Low") WHERE productBarcode = ${data.productBarcode};`
            console.log("Updating SQl records", sql)
            await db.query(sql)


		}}