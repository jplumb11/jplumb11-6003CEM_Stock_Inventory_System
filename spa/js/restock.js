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
    const lowStock = json.data
    for(let i = 0; i < lowStock.length; i++) {
        const tableIndex = i + 1
        const row = table.insertRow(tableIndex)
        row.insertCell(0).innerText = lowStock[i].productName
        row.insertCell(1).innerText = lowStock[i].wholesalePrice
        row.insertCell(2).innerText = lowStock[i].retailPrice
        row.insertCell(3).innerText = lowStock[i].quantity
        const sliderCell = row.insertCell(4)
        const form = makeForm()
        form.appendChild(makeHiddenInput(lowStock[i].id, 'stockId'))
        sliderCell.appendChild(form)
    }
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
    const slider = makeSlider()
    const valueLabel = document.createElement("label")
    valueLabel.innerText = 10
    const button = makeButton()
    form.addEventListener('submit', addOrderItem)
    slider.addEventListener('input', event => {
        valueLabel.innerText = slider.value
    })
    form.appendChild(slider)
    form.appendChild(valueLabel)
    form.appendChild(button)
    return form
}

function makeButton() {
    const button = document.createElement("button")
    button.innerText = "Restock"
    button.type = "submit"
    return button
}

function makeSlider() {
    const slider = document.createElement("input")
    slider.type = "range"
    slider.min = 1
    slider.max = 100
    slider.value = 10
    slider.setAttribute("name", "quantity")
    return slider
}

async function addOrderItem(event) {
    console.log('addOrderItem')
	
    event.preventDefault()
    const formData = {
        itemId: event.target.querySelector('input[name="stockId"]').value,
        quantity: event.target.querySelector('input[name="quantity"]').value,
    }

    console.log(formData)
    //POST
    const url = '/api/v1/orders/POST'
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Authorization': localStorage.getItem('authorization')//check this auth
        },
        body: JSON.stringify(formData)
    }
    console.log(options)
    const response = await fetch(url, options)
    const json = await response.json()
    console.log(json)
    showMessage('Form data added')
    window.location = '/received'
}

//  id, itemId, quantity, requestedUser
