import request, {operateSuccessFunc} from "../request/request";

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
            let result = await request("put", "/api/stages/" + payload.id, payload, operateSuccessFunc)
        },
        async add(payload, rootState) {
            let result = await request("post", "/api/stages", payload, operateSuccessFunc)
        },
        async start(payload, rootState) {
            let result = await request("post", "/api/actions/start_stage", {stageId: payload}, operateSuccessFunc)
        },
        async stop(payload, rootState) {
            let result = await request("post", "/api/actions/stop_stage", {stageId: payload}, operateSuccessFunc)
        },
        async startRaffle(payload, rootState) {
            let result = await request("post", "/api/actions/raffle", {stageId: payload}, operateSuccessFunc)
        },
        async configResult(payload, rootState) {
            let result = await request("post", "/api/actions/advance_contestants", payload, operateSuccessFunc)
        },
        async configReward(payload, rootState) {
            let result = await request("put", "/sysConfig", payload), operateSuccessFunc
        }
    })
}
