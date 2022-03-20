import Ajv from 'https://esm.sh/ajv'
// import Ajv from './ajv.js'

const ajv = new Ajv({allErrors: true})

export const stockSchema = ajv.compile ({
	$schema: "https://json-schema.org/draft/2020-12/schema",
	$id: "https://json-schema.org/draft/2020-12/schema",
    title: "Stock",
    description: " Stock item for an Arduino Microcontrollers buisiness system ",
    type: "object",
    properties: {
        productBarcode: {
            type: "integer",
            description: "The product's 5-digit barcode",
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
            description: "Filename of the product's photo saved on the server",
            minLength: 1,
			maxLength: 40

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
		  userid: {
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
        "productPhoto", 
        "wholesalePrice", 
        "retailPrice",
        "quantity",
		"stockLevel",
		"userid",
		"username"
    ]
})
const validate = ajv.compile(stockSchema)

const obj = {
    stock: 'abc'
}

const valid = validate(obj)

console.log(`valid: ${valid}`)
if(valid === false) console.log(validate.errors)

export const validStock = ajv.compile(stockSchema)