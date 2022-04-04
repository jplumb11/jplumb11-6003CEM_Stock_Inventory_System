// New Items.
import {db} from './db.js'
import {saveFile} from './util.js'
import {validateStockSchema} from './schemas/stockSchema.js'
//add data 
export async function add(data) {
    const image = {
        username: data.username,
        dataURI: data.image
    }
    if(data.image) {
        data.photo = await saveImage(image)
    }
    console.log("logging save image")
    delete data.image /*check if needed*/
    console.log("deleting old image")
    console.log(data)
    console.log("calling add item details")
    data.userID = await addItemDetails(data)
}
//save the image
function saveImage(data) {
    console.log('saving image')
    console.log(data)
    const photo = saveFile(data.dataURI, data.username) //saveFile returns the 
    console.log(photo)
    console.log("logging the photo after dataURI")
    return photo
}
//get method to get one stock item by id
export async function getOneItem(id) {
    const sql = `SELECT * FROM stock WHERE id = ${id};`
    const records = await db.query(sql)
    if(!records[0]) throw new Error(`${id} not found`)
    const record = records[0]
    record.isLow = record.quantity <= 5
    record.isLow.style.color = "red"
    console.log(record)
    return record
}
//Get method to get all stock items
export async function getAll(username) {
    const sql = `SELECT * FROM stock`
    const result = await db.query(sql)
    console.log("get all working")
    result.forEach(result => result.isLow = result.quantity <= 5)
    console.log(result)
    return result
}
// PUT method to update quantity
export async function quantityUpdate(data) {
    const sql = `UPDATE stock
    SET quantity = quantity  + ${quantity}, stockLevel = IF(quantity < 5, "High", "Low")
    WHERE productBarcode = ${productBarcode};`
    await db.query(sql)
}
async function addItemDetails(data) {
        console.log("logging the sql")
        let sql = `SELECT id FROM accounts WHERE user = "${data.username}"`
        console.log(sql)
        let result = await db.query(sql)
        data.userID = result[0].id
        //set the stock level to low if its less than 5
        if(data.quantity <= 5) {
            data.stockLevel = "Low";
        } else {
            data.stockLevel = "High";
        }
        const validationCheck = validateStockSchema(data)
        if (validationCheck ===false) throw new Error("Data invalid through schema")
        console.log("stock level: ", data.stockLevel) 
        console.log(data)
        const dCheck = `SELECT count(id) AS count FROM stock WHERE productBarcode = "${data.productBarcode}";`
        const duplicateCheck = await db.query(dCheck)
    
        if(duplicateCheck[0].count) {
            //if duplicate is found update quantity
            const sql = `UPDATE stock SET quantity = quantity  + ${data.quantity}, stockLevel = IF(quantity <= 5, "High", "Low") WHERE productBarcode = ${data.productBarcode};`
            console.log("Updating SQl records", sql)
            await db.query(sql)
        } else {
            //add new stock item
            sql = `INSERT INTO stock(productBarcode, productName, productPhoto, wholesalePrice, retailPrice, quantity, stockLevel, userID, username)\
	                VALUES("${data.productBarcode}","${data.productName}", "${data.photo}",\
	                "${data.wholesalePrice}","${data.retailPrice}","${data.quantity}","${data.stockLevel}","${data.userID}","${data.username}")`
            sql = sql.replaceAll('"undefined"', 'NULL')
            sql = sql.replaceAll('""', 'NULL')
            console.log("Inserting new records ",sql)
            result = await db.query(sql)
            console.log("Added")
            return result.lastInsertId
        }
}

export async function getLowItems(username){
    let sql = `SELECT * FROM stock WHERE stockLevel = "Low";`
    const result = await db.query(sql)
	console.log("get low items working")

    return result
}