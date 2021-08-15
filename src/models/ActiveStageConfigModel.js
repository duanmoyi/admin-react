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
            let result = await request("get", "/api/stages", undefined)
            dispatch.activeStageConfigModel.updateData(result && result._embedded && result._embedded.stages || [])
        },
        async update(payload, rootState) {
            let result = await request("put", "/api/stages/" + payload.id, payload)
        },
        async add(payload, rootState) {
            let result = await request("post", "/api/stages", payload)
        },
        async start(payload, rootState) {
            let result = await request("post", "/api/actions/start_vote")
        },
        async stop(payload, rootState) {
            let result = await request("put", "/activeStage", payload)
        },
        async configResult(payload, rootState) {
            let result = await request("put", "/activeStage", payload)
        },
        async configReward(payload, rootState) {
            let result = await request("put", "/sysConfig", payload)
        }
    })
}
