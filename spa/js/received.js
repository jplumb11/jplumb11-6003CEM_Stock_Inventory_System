import {customiseNavbar,file2DataURI,loadPage, secureGet,showMessage} from '../util.js'


export async function setup(node) {
    try {
        const username = localStorage.getItem('username')
        document.querySelector('header p').innerText = 'Received'
        //const token = localStorage.getItem('authorization')
        if(localStorage.getItem('authorization') === null) window.location = '/login'
        customiseNavbar(['home', 'logout'])
        const table = node.getElementById('received_table')
        await showOrders(username, table)
    } catch (err) {
        console.error(err)
    }
}


async function showOrders(username, table) {
    console.log("Running show orders")
    const url = `/api/v1/orders/GET`
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
    const allOrders = json.data
    for(let i = 0; i < allOrders.length; i++) {
        const tableIndex = i + 1
        const row = table.insertRow(tableIndex)
        row.insertCell(0).innerText = allOrders[i].item.productName
        row.insertCell(1).innerText = allOrders[i].item.wholesalePrice
        row.insertCell(2).innerText = allOrders[i].item.retailPrice
        row.insertCell(3).innerText = allOrders[i].quantity
        const formCell = row.insertCell(4)
        const form = makeForm()
        form.appendChild(makeHiddenInput(allOrders[i].id, 'stockId'))
        formCell.appendChild(form)
    }
}

async function putOrder(event){
    console.log("Running PUT to update orders")
    event.preventDefault()
    const formData = {
        itemId: event.target.querySelector('input[name="stockId"]').value
    }
    const url = `/api/v1/stock/PUT/:id`
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Authorization': localStorage.getItem('authorization')
        },
        body: JSON.stringify(formData)
    }
    const response = await fetch(url, options)
    const json = await response.json()
    console.log(json)
    console.log(response)
    //reload the page
}

function makeHiddenInput(data, name) {
    const hidden = document.createElement("input")
    hidden.type = "hidden"
    hidden.value = data
    hidden.setAttribute("name", name)
    return hidden
}

function makeForm() {
    const form = document.createElement("form")
    const button = makeButton()
    form.addEventListener('submit', putOrder)
    form.appendChild(button)
    return form
}

function makeButton() {
    const button = document.createElement("button")
    button.innerText = "Restock"
    button.type = "submit"
    return button
}
