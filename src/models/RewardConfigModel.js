import request from "../request/request";

export default {
    state: {
        data: []
    },
    reducers: {
        updateData: (state, payload) => {
            const {data, ...other} = state
            return {
                data: payload,
                ...other
            }
        },
    },
    effects: (dispatch) => ({
        async init(payload, rootState) {
            let result = await request("get", "/api/rewards", undefined)
            dispatch.rewardConfigModel.updateData(result && result._embedded && result._embedded.rewards || [])
        },
        async update(payload, rootState) {
            let result = await request("put", "/api/rewards/" + payload.id, payload)
        },
        async add(payload, rootState) {
            let result = await request("post", "/api/rewards", payload)
        },
        async delete(payload, rootState) {
            let result = await request("delete", "/api/rewards" + payload)
        },
    })
}
