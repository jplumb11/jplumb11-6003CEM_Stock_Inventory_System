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
    let lowFill = `<tr><td>Product Name</td><td>Wholesale Price</td><td>Retail Price</td><td>Quantity</td><td> Increase Quantity</tr>`
    json.data.forEach(lowStock => {
        lowFill += `<tr><td>${lowStock.productName}</td><td>${lowStock.wholesalePrice}</td><td>${lowStock.retailPrice}</td><td>${lowStock.quantity}</td><td>${makeForm()}</td></tr>`
    console.log(lowStock)
    console.log(lowFill)
    })
    table.innerHTML = lowFill /*fill*/
}

function makeForm() {
    const form = document.createElement("form")
    const slider = makeSlider()
    const valueLabel = document.createElement("label")
    valueLabel.innerText = 10
    const button = makeButton()
    form.addEventListener('submit', addOrderItem)
    slider.oninput = function() {
        valueLabel.value = this.value
    }
    form.appendChild(slider)
    form.appendChild(valueLabel)
    form.appendChild(button)
    return form.outerHTML
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
       
        quantity: event.target.querySelector('input[name="quantity"]').value,
    }

    console.log(formData)
    //POST
    const url = '/api/v1/order/POST'
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
    loadPage('home')
}

//  id, itemId, quantity, requestedUser
