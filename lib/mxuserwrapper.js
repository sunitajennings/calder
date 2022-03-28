import constants from "./constants.js"

import { create_user, list_users } from "../services/mxapi-users.js"

export async function create_or_retrieve_user(clientId) {
    let requestedUser = await create_user(clientId)
    if (requestedUser.response && requestedUser.response.status == constants.HTTP_409_CONFLICT) {
        requestedUser = await find_user(clientId)
    }
    console.log(requestedUser)
    return requestedUser
}

async function find_user(clientId) {
    let foundUser = []
    let allUsers = await list_users()

    for (let i = 0; i < allUsers.users.length; i++) {
        if (allUsers.users[i].id == clientId) {
            foundUser = allUsers.users[i]
            break
        }
    }
    return foundUser
}
