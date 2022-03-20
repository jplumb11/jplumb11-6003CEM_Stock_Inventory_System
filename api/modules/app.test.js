/* app.test.js */

import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts'
import { assert, assertEquals } from 'https://deno.land/std@0.79.0/testing/asserts.ts'

import app from './app.js'
import { stockSchema } from '../apischema.js'

Deno.test('make a GET request to return a stock object', async () => {
	const request = await superoak(app)
	const response = await request.get('/')
	assertEquals(response.status, 200, `invalid status code. Expected 200 but got ${response.status}`)
	const valid = person(response.body)
	assert(valid, JSON.stringify(person.errors, null, 2))
})