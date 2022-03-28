import fetch from 'node-fetch'
import { constants, HTTPResponseError } from './mxapi.js'

export async function create_member_for_verification(institution, user, id, credential1_guid, credential1_value, credential2_guid, credential2_value) {
    console.log("POST " + constants().mx_base_url + "/users/" + user + "/members")
    try {
        const memberbody = {
            "member": {
                "credentials": [{
                    "guid": credential1_guid,
                    "value": credential1_value
                },
                {
                    "guid": credential2_guid,
                    "value": credential2_value
                }
                ],
                "id": id,
                "institution_code": institution,
                "skip_aggregation": true
            }
        }

        const memberresponse = await fetch(constants().mx_base_url + '/users/' + user + '/members', {
            method: 'POST',
            headers: constants().mx_api_headers,
            body: JSON.stringify(memberbody)
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                console.log("^^" + response.status + ' ' + response.statusText)
                throw new HTTPResponseError(response)
            }
        })
        console.log(memberresponse)
        return memberresponse.member

    } catch (error) {
        return error
    }
}

export async function update_member(member, user, credential1_guid, credential1_value, credential2_guid, credential2_value) {
    console.log("PUT " + constants().mx_base_url + "/users/" + user + "/members/" + member)

    try {
        const memberbody = {
            "member": {
                "credentials": [{
                    "guid": credential1_guid,
                    "value": credential1_value
                },
                {
                    "guid": credential2_guid,
                    "value": credential2_value
                }
                ]
            }
        }

        const memberresponse = await fetch(constants().mx_base_url + '/users/' + user + '/members/' + member, {
            method: 'PUT',
            headers: constants().mx_api_headers,
            body: JSON.stringify(memberbody)
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                console.log(response.status + ' ' + response.statusText)
                throw new HTTPResponseError(response)
            }
        })
        console.log(memberresponse)
        return memberresponse.member

    } catch (error) {
        return error
    }
}

export async function list_members(user) {
    console.log('GET ' + constants().mx_base_url + '/users/' + user + '/members?page=1&records_per_page=5')
    try {
        const response = await fetch(constants().mx_base_url + '/users/' + user + '/members?page=1&records_per_page=5', {
            method: 'GET',
            headers: constants().mx_api_headers
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                console.log(response.status + ' ' + response.statusText)
                throw new HTTPResponseError(response)
            }
        })

        if (response.members.length > 0) {
            console.log(response.members)
        }
        return response;

    } catch (error) {
        return error
    }

}

export async function read_member_status(user, member) {
    console.log("GET " + constants().mx_base_url + "/users/" + user + '/members/' + member + '/status')
    try {
        const memberresponse = await fetch(constants().mx_base_url + '/users/' + user + '/members/' + member + '/status', {
            method: 'GET',
            headers: constants().mx_api_headers
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                console.log(response.status + ' ' + response.statusText)
                throw new HTTPResponseError(response)
            }
        })

        console.log(memberresponse)
        return memberresponse.member


    } catch (error) {
        return error
    }
}

export async function resume_connection(user, member) {
    console.log("NOOP : PUT " + constants().mx_base_url + "/users/" + user + '/members/' + member + '/resume')
    //PUT /users/{user_guid}/members/{member_guid}/resume


    const memberchallenges = {
        "member": {
            "challenges": [{
                "guid": credential1_guid,
                "value": credential1_value
            },
            {
                "guid": credential2_guid,
                "value": credential2_value
            }
            ],
            "institution_code": institution,
            "skip_aggregation": true
        }
    }
}

export async function start_verification(user, member) {
    console.log("POST " + constants().mx_base_url + "/users/" + user + '/members/' + member + '/verify')
    try {
        const memberresponse = await fetch(constants().mx_base_url + '/users/' + user + '/members/' + member + '/verify', {
            method: 'POST',
            headers: constants().mx_api_headers
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                console.log("^^" + response.status + ' ' + response.statusText)
                throw new HTTPResponseError(response)
            }
        })

        console.log(memberresponse)
        return memberresponse.member


    } catch (error) {
        return error
    }

}