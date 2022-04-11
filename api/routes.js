import { Router, helpers } from 'https://deno.land/x/oak@v6.5.1/mod.ts'

import { extractCredentials, saveFile } from './modules/util.js'
import { login, register } from './modules/accounts.js'
import { add, getAll, getOneItem, quantityUpdate, getLowItems} from './modules/newItems.js'
import {getOrders, addOrder, updateReceived} from './modules/orders.js'
import { stockSchema } from './schemas/stockSchema.js'
import { orderSchema } from './schemas/orderSchema.js'

const router = new Router()





// the routes defined here
router.get('/', async context => {
	console.log('GET /')
	const data = await Deno.readTextFile('spa/index.html')
	context.response.body = data
})

router.get('/api/v1/accounts', async context => {
	console.log('GET /api/accounts')
	const token = context.request.headers.get('Authorization')
	console.log(`auth: ${token}`)
	try {
		const credentials = extractCredentials(token)
		console.log(credentials)
		const username = await login(credentials)
		console.log(`username: ${username}`)
		context.response.status = 200
		context.response.body = JSON.stringify(
			{
				data: { username: username }
			}, null, 2)
	} catch(err) {
		context.response.status = 401
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: '401 Unauthorized.',
						detail: err.message
					}
				]
			}
		, null, 2)
	}
})

router.post('/api/v1/accounts', async context => {
	const body  = await context.request.body()
	const data = await body.value
	console.log(data)
	await register(data)
	context.response.status = 201
	context.response.body = JSON.stringify({ status: 'success', msg: 'account created' })
})

//for add stock
router.post('/api/v1/stock', async context => {
	console.log('POST /api/v1/stock/POST')
	let user = null
	try {
       const token = context.request.headers.get('Authorization')//check auth
	   console.log(`auth: ${token}`)

       if(!token) throw new Error('missing Authorization header')
       const credentials = extractCredentials(token)
       user = await login(credentials)
    } catch(err) {
		context.response.status = 400
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: 'a problem occurred',
						detail: err.message
					}
				]
			}
		)
        
    }
	//valid credentials
	try {
		const { value } = context.request.body({ type: 'json'});
		const data = await value
		data.username = user
		console.log("logging prior to add function")
		const result = await add(data)
	}   catch(err) {
		console.log(err)
		context.response.status = 400
		context.response.body = { status: 'error', msg: 'item not added', log: err.message }
		return	
	}
	console.log("Sending Response")
	context.response.status = 201
	context.response.body = JSON.stringify(context.response.body = { status: 'added', msg: 'new stock added' }, null, 2)
	console.log("API stock posting")
})

//home page

router.get('/api/v1/stock', async context => {
	console.log("/api/v1/stock/GET")
	const host = context.request.url.host
	let user = null
	try {
       const token = context.request.headers.get('Authorization')
       if(!token) throw new Error('missing Authorization header')
       const credentials = extractCredentials(token)
       user = await login(credentials)
      
    } catch(err){
        context.response.status = 401
        context.response.body = { status: 'unauthorised', msg: 'Basic Auth required', log: err.message}
        console.log(err)
		return   
    }	
	try {
		console.log(user)
		const stock = await getAll(user.username)//gets all records
		const data = {
            name: 'Stock',
            description: 'a list of stock items',
            schema: {
                productBarcode: 'integer',
                productName: 'string',
                productPhoto: 'img',
                wholesalePrice: 'integer',
				retailPrice: 'integer',
                quantity: 'integer',
                stockLevel: 'string',
                userID: 'integer',
                username: 'string'
            },
            links: [
                {
                    href:`https://${host}/api/v1/stock`,
                    rel: "self",
                    type: "GET"
                },
                {
                    href:`https://${host}/api/v1/stock/lowItems`,
                    rel: "low stock items",
                    type: "GET"
                },
				{
                    href:`https://${host}/api/v1/stock/:id`,
                    rel: "self",
                    type: "GET"
                }
            ],
            data: stock
        }
		
		context.response.status = 200
		context.response.body = JSON.stringify(data, null, 2)
		console.log("getAll being called ")

	}catch (err){
		console.log(err)
	}
})

//Get route to get low items for restock
router.get('/api/v1/stock/lowItems', async context => {
		const host = context.request.url.host
		let user = null
	try {
       const token = context.request.headers.get('Authorization')
       if(!token) throw new Error('missing Authorization header')
       const credentials = extractCredentials(token)
       user = await login(credentials)
      
    } catch(err){
        context.response.status = 401
        context.response.body = { status: 'unauthorised', msg: 'Basic Auth required', log: err.message}
        console.log(err)
		return   
	}
	try {
		console.log(user)
		const lowStock = await getLowItems(user.username)//gets all records
		const data = {
            name: 'Low Stock',
            description: 'a list of low stock items',
            schema: {
                productBarcode: 'integer',
                productName: 'string',
                productPhoto: 'img',
                wholesalePrice: 'integer',
				retailPrice: 'integer',
                quantity: 'integer',
                stockLevel: 'string',
                userID: 'integer',
                username: 'string'
            },
            links: [
                {
                    href:`https://${host}/api/v1/stock/lowItems`,
                    rel: "self",
                    type: "GET"
                },
                {
                    href:`https://${host}/api/v1/stock`,
                    rel: "all items",
                    type: "GET"
                },
				{
                    href:`https://${host}/api/v1/stock/:id`,
                    rel: "self",
                    type: "GET"
                }
            ],
            data: lowStock
        }
		
		context.response.status = 200
		context.response.body = { status: 'success', data: lowStock }
		console.log("getLowItems  being called ")

	}catch (err){
		console.log(err)
	}

})


//GET  to get one item

router.get('/api/v1/stock/:id', async context => {
		console.log('GET /api/v1/stock/:id')
		context.response.headers.set('Allow', 'GET, PUT')
		const query = helpers.getQuery(context, { mergeQuery: true })
		const host = context.request.url.host
		let user = null
	try {
       const token = context.request.headers.get('Authorization')
       if(!token) throw new Error('missing Authorization header')
       const credentials = extractCredentials(token)
       user = await login(credentials)
      
    } catch(err){
        context.response.status = 401
        context.response.body = { status: 'unauthorised', msg: 'Basic Auth required', log: err.message}
        console.log(err)
		return   
	}
	try {
		console.log(user)
		const stockItem = await getOneItem(query.id)//gets all records
		const data = {
            name: 'One item',
            description: 'Retreiving one stock item',
            schema: {
                productBarcode: 'integer',
                productName: 'string',
                productPhoto: 'img',
                wholesalePrice: 'integer',
				retailPrice: 'integer',
                quantity: 'integer',
                stockLevel: 'string',
                userID: 'integer',
                username: 'string'
            },
            links: [
                {
                    href:`https://${host}/api/v1/stock/:id`,
                    rel: "self",
                    type: "GET"
                },
				{
                    href:`https://${host}/api/v1/stock`,
                    rel: "self",
                    type: "GET"
                },
                {
                    href:`https://${host}/api/v1/stock/lowItems`,
                    rel: "low stock items",
                    type: "GET"
                }
            ],
            data: stockItem
        }
		
		context.response.status = 200
		context.response.body = JSON.stringify(data, null, 2)

	}catch (err){
		console.log(err)
	}

})

//api/v1//showOrders
router.get('/api/v1/orders', async context => {
	console.log("Getting all orders to be received")
		const host = context.request.url.host
		let user = null
	try {
       const token = context.request.headers.get('Authorization')
       if(!token) throw new Error('missing Authorization header')
       const credentials = extractCredentials(token)
       user = await login(credentials)
      
    } catch(err){
        context.response.status = 401
        context.response.body = { status: 'unauthorised', msg: 'Basic Auth required', log: err.message}
        console.log(err)
		return   
	}
	try {
		console.log(user)
		const allOrders = await getOrders(user.username)//gets all records
		const data = {
            name: '',
            description: 'a list of low stock items',
            schema: {
                itemId: 'integer',
				quantity: 'integer',
				receivedStatusYN: 'boolean'
            },
            links: [
                {
                    href:`https://${host}/api/v1/orders/showOrders`,
                    rel: "self",
                    type: "GET"
                },
				{
                    href:`https://${host}/api/v1/orders/received`,
                    rel: "self",
                    type: "GET"
                }
            ],
            data: allOrders
        }
		
		context.response.status = 200
		context.response.body = JSON.stringify(data, null, 2)
		console.log("getLowItems  being called ")

	}catch (err){
		console.log(err)
	}

})
//route to post the order
router.post('/api/v1/orders', async context => {
	try {
		const { value } = context.request.body({ type: 'json'});
		const data = await value
		console.log("logging prior to add function")
		const result = await addOrder(data)
	}   catch(err) {
		console.log(err)
		context.response.status = 400
		context.response.body = { status: 'error', msg: 'item not added', log: err.message }
		
		return	
	}
	console.log("Sending Response")
	context.response.status = 201
	context.response.body = JSON.stringify(context.response.body = { status: 'added', msg: 'new stock added' }, null, 2)
	console.log("API stock posting")
})

//PUT to update received list
router.put('/api/v1/orders/:id', async context => {
	console.log("/api/v1//orders/PUT/:id")
	try {
		const { value } = context.request.body({ type: 'json'});
		const data = await value
		console.log("logging prior to add function")
		const result = await updateReceived(data.id)
	}   catch(err) {
		console.log(err)
		context.response.status = 400
		context.response.body = { status: 'error', msg: 'item not added', log: err.message }
		
		return	
	}
	context.response.status = 201
	context.response.body = JSON.stringify(context.response.body = { status: 'added', msg: 'new stock added' }, null, 2)
})



router.get("/(.*)", async context => {      
// 	const data = await Deno.readTextFile('static/404.html')
// 	context.response.body = data
	const data = await Deno.readTextFile('spa/index.html')
	context.response.body = data
})

export default router