import request, {deleteContestantPrompt, operateSuccessFunc} from "../request/request";
import {defaultPage, tableFetch} from "../utils/core";

export default {
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
            let result = await tableFetch(payload, "api/contestants", "contestants")
            dispatch.contestantConfigModel.updateData(result)
        },
        async update(payload, rootState) {
            let result = await request("put", "api/contestants/" + payload.id, payload, operateSuccessFunc)
        },
        async add(payload, rootState) {
            let result = await request("post", "api/contestants", payload, operateSuccessFunc)
        },
        async delete(payload, rootState) {
            let result = await request("delete", "api/contestants/" + payload, operateSuccessFunc, deleteContestantPrompt)
        },
    })
}
