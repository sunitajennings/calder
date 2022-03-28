import express from 'express'
import path from 'path'
import dotenv from 'dotenv'

import { fileURLToPath } from 'url'

import { get_credentials, get_institution, list_institutions } from "./services/mxapi-institutions.js"
import { create_member_for_verification, list_members, read_member_status, start_verification, update_member } from "./services/mxapi-members.js"

import { create_or_retrieve_user } from "./lib/mxuserwrapper.js"
import { create_or_retrieve_member } from "./lib/mxmemberwrapper.js"
import { get_verifiable_accounts } from './lib/verification.js'

dotenv.config()
var port = process.env.PORT || 3000;

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)

var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set("view engine", "ejs")

//serve the index
app.get('/', function (request, response) {
    console.log(request.method + " " + request.url)
    response.sendFile(__dirname + '/public/index.html')
})

//alphabetical by endpoint
app.get('/apiflow/institutioncredentials', async function (request, response) {
    console.log(request.method + " " + request.url)

    let credentialresponse = await get_credentials(request.query.selectedInstitution)
    let institutionresponse = await get_institution(request.query.selectedInstitution)

    response.render('flow_api_login', {
        requestparams: {
            steps: ['GET /institutions?supports_account_verification=true',
                'GET  /institutions/' + request.query.selectedInstitution + '/credentials'],
            clientId: request.query.clientId,
            credentials: credentialresponse.credentials,
            selectedInstitution: institutionresponse.institution
        }
    })
})
app.get('/apiflow/institutions', async function (request, response) {
    console.log(request.method + " " + request.url)
    const institutionresponse = await list_institutions()

    response.render('flow_api_institutions', {
        requestparams: {
            steps: ['GET /institutions?supports_account_verification=true'],
            institutions: institutionresponse.institutions
        }
    })
})
app.post('/apiflow/institutions/:institutionCode/connect', async function (request, response) {
    console.log(request.method + " " + request.url)

    //create user or pull up existing user
    let requestedUser = await create_or_retrieve_user(request.body.clientId)

    //create member or get a list of members this user has at this institution
    let requestedMember = await create_or_retrieve_member(requestedUser.guid, request.params.institutionCode,
        request.body.credentials_0_guid, request.body.credentials_0_value,
        request.body.credentials_1_guid, request.body.credentials_1_value)

    //verification job
    if (requestedMember.guid) {
        let challengeOptions = await get_verifiable_accounts(requestedMember)


    }
    else {
        console.log("This case isn't handled: multiple members, probably")
        console.log(requestedMember)
    }

})

var listener = app.listen(port, function () {
    console.log('calder is listening on port ' + listener.address().port)
})