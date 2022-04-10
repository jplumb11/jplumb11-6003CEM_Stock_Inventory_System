import {customiseNavbar,loadPage,secureGet,showMessage,file2DataURI} from '../util.js'
//import {validStock} from '../schema/apischema.js'

export async function setup(node) {
    console.log('ADD: setup')
    try {
        console.log(node)
        document.querySelector('header p').innerText = 'Add Stock'
        if(localStorage.getItem('authorization') === null) window.location = '/login'
        customiseNavbar(['home', 'logout'])

    } catch (err) {
        console.error(err)
    }
    //to pull the data from the form 
	

    node.querySelector('input[name="wholesaleAmount"]').addEventListener('change', await wholesaleSlideUpdate)
	node.querySelector('input[name="retailAmount"]').addEventListener('change', await retailSlideUpdate)
	node.querySelector('input[name="quantity"]').addEventListener('change', await quantitySlideUpdate)
    node.querySelector('input[type="file"]').addEventListener ('change', await displayImage)

	node.querySelector('form').addEventListener('submit', await addStockItem)
}

async function displayImage(event) {
    console.log('displayImage')
    const files = event.target.files
    const file = files[0]
    if(file) {
        const data = await file2DataURI(file)
        document.querySelector('form img').src = data
    }
}

async function retailSlideUpdate() {
    const retailOutput = document.querySelector('[name=retailAmount_val]')
    retailOutput.value = this.value
}
async function wholesaleSlideUpdate() {
    const wholesaleOutput = document.querySelector('[name=wholesaleAmount_val]')
    wholesaleOutput.value = this.value
}

async function quantitySlideUpdate() {
    const quantityOutput = document.querySelector('[name=quantity_val]')
    quantityOutput.value = this.value
}





async function addStockItem(event) {
    console.log('addStockItem')
	
    event.preventDefault()
    const formData = {
        productBarcode: event.target.querySelector('input[name="productBarcode"]').value,
        productName: event.target.querySelector('input[name="productName"]').value,
        wholesalePrice: event.target.querySelector('input[name="wholesaleAmount"]').value,
        retailPrice: event.target.querySelector('input[name="retailAmount"]').value,
        quantity: event.target.querySelector('input[name="quantity"]').value,
    }
    // Barcode, productName,image,wholesalePrice,retailPrice,quantity,submit

    const image = event.target.querySelector('input[name="image"]')
    const files = image.files
    //change the raw file to URI format
    if(files[0]) {
        const file = files[0]
        const data = await file2DataURI(file)
        formData.image = data
    }
    console.log(formData)
    //POST
    const url = '/api/v1/stock'
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