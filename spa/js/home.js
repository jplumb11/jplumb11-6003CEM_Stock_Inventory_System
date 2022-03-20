import { customiseNavbar, file2DataURI, loadPage, secureGet, showMessage } from '../util.js'

export async function setup(node) {
 console.log('HOME: setup')
     try {
         console.log(node)
         const username = localStorage.getItem('username')
		   if(localStorage.getItem('authorization') === null) window.location = '/login'
   		if(localStorage.getItem('username') !== "admin") window.location = '/home'
         document.querySelector('header p').innerText = 'Home'
         customiseNavbar(['addStock', 'restock', 'received', 'logout']) // navbar if admin logged in
         if(localStorage.getItem('username') !== "admin") customiseNavbar(['logout'])
         const table = node.getElementById('content_table')
         const displayTotal = node.getElementById('totalValue')
         await showItems(username, table, displayTotal)
     } catch (err) {
         console.error(err)
     }
 }

async function showItems(username, table, displayTotal) {
    console.log(`username: ${username}`)
    console.log("Running showItems")
    const url = `/api/v1/stock/GET` //change this
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Authorization': localStorage.getItem('authorization')
        }
    }
    // const template = document.querySelector('template#home')
    // const fragment = template.content.cloneNode(true)
    console.log(options)
    const response = await fetch(url, options)
    const json = await response.json()
    console.log("logging JSON")
    console.log(json)
    let content = `<tr><td>Product Name</td><td>Wholesale Price</td><td>Retail Price</td><td>Quantity</td></tr>`
    let addingTesting = ''
    const multiList = []
json.data.forEach(stock => {
    const colorClass = stock.isLow ? 'class="red"' : ''
    content += `<tr><td>${stock.productName}</td><td>${stock.wholesalePrice}</td><td>${stock.retailPrice}</td><td ${colorClass}>${stock.quantity}</td></tr>`
    addingTesting = Number(stock.wholesalePrice) * Number(stock.quantity)
    multiList.push(addingTesting)
    console.log("logging stock for each")
    console.log(addingTesting)
})
console.log(multiList)
let totalStockValue = 0;
for(let i = 0; i < multiList.length; i++) {
    totalStockValue += multiList[i]
}
console.log(totalStockValue)
displayTotal.innerHTML = (totalStockValue)
table.innerHTML = content /*fill*/
}