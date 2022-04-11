


import Ajv from './ajv.js'

const ajv = new Ajv({allErrors: true})

export const orderSchema = {
    title: "Order",
    description: "Stock item in need of restock on the  buisiness system ",
    type: "object",
    properties: {
        itemId: {
            type: "integer",
            description: "The item ID of the product",
            exclusiveMinimum: 0
        },
        quantity: {
            type: "integer",
            description: "The amount of the stock ordered",
            exclusiveMinimum: 0
        },
        receivedStatusYN: {
            type: "boolean",
            description: "Whether the item has been restocked or order received",
        }
    },
    required: [
        "itemId",
        "quantity",
        "receivedStatusYN"
    ]
}

const validate = ajv.compile(orderSchema)

//check with mark again

export const validateOrderSchema = (json) => {
    const validationCheck = validate(json)
    if (validationCheck === false) console.log(validate.errors)
    return validationCheck
}