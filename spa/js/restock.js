//restock.js

import {customiseNavbar,file2DataURI,loadPage, secureGet,showMessage} from '../util.js'

export async function setup(node) {
    try {
        const username = localStorage.getItem('username')
		document.querySelector('header p').innerText = 'Restock'
		 //const token = localStorage.getItem('authorization')
         if(localStorage.getItem('authorization') === null) window.location = '/login'
        customiseNavbar(['home', 'logout'])
        const table = node.getElementById('restock_table')
        await showLowItems(username, table)
    
} catch (err) {
    console.error(err)
}
}
async function showLowItems(username, table) {
    console.log("Running show low items")
    const url = `/api/v1/stock/lowItems/GET`
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Authorization': localStorage.getItem('authorization')
        }
    }
    const response = await fetch(url, options)
    const json = await response.json()
    console.log(json)
    console.log(response)
    let lowFill = `<tr><td>Product Name</td><td>Wholesale Price</td><td>Retail Price</td><td>Quantity</td></tr>`
    json.data.forEach(lowStock => {
        lowFill += `<tr><td>${lowStock.productName}</td><td>${lowStock.wholesalePrice}</td><td>${lowStock.retailPrice}</td><td>${lowStock.quantity}</td></tr>`
    console.log(lowStock)
    console.log(lowFill)
    })
table.innerHTML = lowFill /*fill*/
}