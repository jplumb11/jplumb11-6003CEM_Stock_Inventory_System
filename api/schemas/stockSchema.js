import Ajv from './ajv.js'

const ajv = new Ajv({allErrors: true})

export const stockSchema = {
    title: "Stock",
    description: " Stock item for an Arduino Microcontrollers buisiness system ",
    type: "object",
    properties: {
        productBarcode: {
            type: "integer",
            description: "The items 8 digit barcode",
            minimum: 10000000,
            maximum: 99999999
        },
        productName: {
            type: "string",
            description: "The name of the product",
            minLength: 1,
            maxLength: 40
        },
        productPhoto: {
            type: "string",
            description: "Name of the photo",
            minLength: 1,

        },
        wholesalePrice: {
            type: "integer",
            description: "The wholesale price of the stock item",
            minimum: 0,
            maximum: 30
        },
        retailPrice: {
            type: "integer",
            description: "The retail price of the stock item",
            minimum: 0,
            maximum: 30
        },
        quantity: {
            type: "integer",
            description: "The volume of  items to be added to the total stock",
            minimum: 0,
            maximum: 100
        },
        stockLevel: {
            type: "string",
            description: "The current stock level, either high or low",
            minLength: 3,
            maxLength: 4
        },
		  userID: {
            type: "integer",
            description: "The user identification number of the user that added the current item",
            minimum: 1
        },
		  username: {
            type: "string",
            description: "The username of the user that added the current item",
            minLength: 1,
            maxLength: 30
        }
    },
    required: [
        "productBarcode", 
        "productName", 
        "wholesalePrice", 
        "retailPrice",
        "quantity",
		"stockLevel",
		"userID",
		"username"
    ]
}
const validate = ajv.compile(stockSchema)
//check with mark again
export const validateStockSchema = (json) => {
    const validationCheck = validate(json)
    if (validationCheck === false) console.log(validate.errors)
    return validationCheck
}