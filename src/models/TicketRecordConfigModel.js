import request from "../request/request";
import {defaultPage, tableFetch} from "../utils/core";

export default  {
    state: {
        data: [],
        page: defaultPage
    },
    reducers: {
        updateData: (state, payload) => {
            return payload
        },
    },
    effects: (dispatch) => ({
        async init(payload, rootState) {
            let result = await tableFetch(payload, "api/vote_records", "voteRecords")
            dispatch.ticketRecordConfig.updateData(result)
        },
    })
}
