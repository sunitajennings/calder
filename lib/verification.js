import { read_member_status, start_verification } from "../services/mxapi-members.js"
import constants from "./constants.js"

const connectionStatus = {
    inital: constants.CONNECTION_CREATED,
    states: {
        CREATED: {

        }
    }
}


export async function get_verifiable_accounts(member) {
    let verificationResponse = await start_verification(member.user_guid, member.guid)

    if (verificationResponse.response && verificationResponse.response.status == constants.HTTP_409_CONFLICT) {
        console.log("Verification is already in progress")
    }

    let memberStatus = await read_member_status(member.user_guid, member.guid)

    if (memberStatus.connection_status == constants.CHALLENGE_EXPIRED) {
        console.log("Connection expired, attempt verification again")
        verificationResponse = await start_verification(member.user_guid, member.guid)
        memberStatus = await read_member_status(member.user_guid, member.guid)
    }

    if (memberStatus.connection_status == constants.CONNECTION_CHALLENGED && memberStatus.challenges[0].type == constants.CHALLENGE_TYPE_OPTIONS) {
        console.log(memberStatus.challenges[0].options)
        return memberStatus.challenges[0].options
    }

    return memberStatus
}