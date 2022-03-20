import {customiseNavbar,file2DataURI,loadPage, secureGet,showMessage} from '../util.js'
export async function setup(node) {
    try {
        const username = localStorage.getItem('username')
        document.querySelector('header p').innerText = 'Received'
        //const token = localStorage.getItem('authorization')
        if(localStorage.getItem('authorization') === null) window.location = '/login'
        customiseNavbar(['home', 'logout'])
        const table = node.getElementById('received_table')
        // await showLowItems(data.id, table)
    } catch (err) {
        console.error(err)
    }
}