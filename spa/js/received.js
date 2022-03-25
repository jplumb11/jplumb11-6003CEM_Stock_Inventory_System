import {customiseNavbar,file2DataURI,loadPage, secureGet,showMessage} from '../util.js'


export async function setup(node) {
    try {
        const username = localStorage.getItem('username')
        document.querySelector('header p').innerText = 'Restock'
        //const token = localStorage.getItem('authorization')
        if(localStorage.getItem('authorization') === null) window.location = '/login'
        customiseNavbar(['home', 'logout'])
        const table = node.getElementById('received_table')
        await showLowItems(username, table)
    } catch (err) {
        console.error(err)
    }
}


async function showOrders(username, table) {
    console.log("Running show orders")
    const url = `/api/v1/orders/showOrders/GET`
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
    let orderFill = `<tr><td>Product Name</td><td>Wholesale Price</td><td>Retail Price</td><td>Quantity</td><td> Increase Quantity</tr>`
    json.data.forEach(allOrders => {
        orderFill += `<tr><td>${allOrders.productName}</td><td>${allOrders.wholesalePrice}</td><td>${allOrders.retailPrice}</td><td>${allOrders.quantity}</td></tr>`
    console.log(allOrders)
    console.log(orderFill)
    })
table.innerHTML = orderFill /*fill*/
}

async function putOrder(data){
    console.log("Running PUT to update orders")
    const url = `/api/v1/stock/PUT/:id`
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Authorization': localStorage.getItem('authorization')
        },
        body: JSON.stringify(body)
    }
    const response = await fetch(url, options)
    const json = await response.json()
    console.log(json)
    console.log(response)
    //reload the page
}