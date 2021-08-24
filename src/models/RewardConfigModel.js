import request from "../request/request";
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
            let result = await tableFetch(payload, "api/rewards", "rewards")
            dispatch.rewardConfigModel.updateData(result)
        },
        async update(payload, rootState) {
            let result = await request("put", "api/rewards/" + payload.id, payload)
        },
        async add(payload, rootState) {
            let result = await request("post", "api/rewards", payload)
        },
        async delete(payload, rootState) {
            let result = await request("delete", "api/rewards" + payload)
        },
    })
}
