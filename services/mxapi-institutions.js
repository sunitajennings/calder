import fetch from 'node-fetch'
import { constants } from './mxapi.js'

export async function get_credentials(institution_code) {
    console.log("GET " + constants().mx_base_url + "/institutions/" + institution_code + "/credentials")

    try {
        const credentialsresponse = await fetch(constants().mx_base_url + '/institutions/' + institution_code + '/credentials', {
            method: 'GET',
            headers: constants().mx_api_headers
        }).then(response => {
            return response.json()
        })
        console.log(credentialsresponse)
        return credentialsresponse

    } catch (error) {
        console.error(error)
        return error
    }
}

export async function get_institution(institution_code) {
    console.log("GET " + constants().mx_base_url + "/institutions/" + institution_code)

    try {
        const response = await fetch(constants().mx_base_url + '/institutions/' + institution_code, {
            method: 'GET',
            headers: constants().mx_api_headers
        }).then(response => {
            return response.json()
        })
        console.log(response)
        return response

    } catch (error) {
        console.log(error)
        return error
    }
}


export async function list_institutions() {
    console.log("GET " + constants().mx_base_url + "/institutions?supports_account_verification=true")

    try {
        const institutionresponse = await fetch(constants().mx_base_url + '/institutions?supports_account_verification=true', {
            method: 'GET',
            headers: constants().mx_api_headers
        }).then(response => {
            return response.json()
        })
        //console.log(institutionresponse)
        return institutionresponse

    } catch (error) {
        console.error(error)
        return error
    }
}