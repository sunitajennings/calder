import crypto from "crypto"
import constants from "./constants.js"

import { create_member_for_verification, list_members } from "../services/mxapi-members.js"

export async function create_or_retrieve_member(userGuid, institutionCode, credentials_0_guid, credentials_0_value, credentials_1_guid, credentials_1_value) {
    let newMemberId = institutionCode + "_" + crypto.randomBytes(10).toString("hex")
    let requestedMember = await create_member_for_verification(institutionCode, userGuid, newMemberId,
        credentials_0_guid, credentials_0_value,
        credentials_1_guid, credentials_1_value)

    let foundMemberList = []
    if (requestedMember.response && requestedMember.response.status == constants.HTTP_409_CONFLICT) {
        foundMemberList = await find_members(userGuid, institutionCode)

        console.log("Found " + foundMemberList.length + " possible member matches.")

        if (foundMemberList.length > 1) {
            return foundMemberList
        }

        requestedMember = foundMemberList[0]
    }

    return requestedMember
}

async function find_members(user_guid, institution_code) {
    let foundMembers = []
    let allMembers = await list_members(user_guid)

    for (let i = 0; i < allMembers.members.length; i++) {
        if (allMembers.members[i].institution_code == institution_code) {
            foundMembers.push(allMembers.members[i])
        }
    }
    return foundMembers
}