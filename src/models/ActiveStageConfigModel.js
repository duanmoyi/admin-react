import request, {operateSuccessFunc} from "../request/request";
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
            let result = await tableFetch(payload, "api/stages", "stages")
            dispatch.activeStageConfigModel.updateData(result)
        },
        async update(payload, rootState) {
            let result = await request("put", "api/stages/" + payload.id, payload, operateSuccessFunc)
        },
        async add(payload, rootState) {
            let result = await request("post", "api/stages", payload, operateSuccessFunc)
        },
        async start(payload, rootState) {
            let result = await request("post", "api/actions/start_stage", {stageId: payload}, operateSuccessFunc)
        },
        async stop(payload, rootState) {
            let result = await request("post", "api/actions/stop_stage", {stageId: payload}, operateSuccessFunc)
        },
        async startRaffle(payload, rootState) {
            let result = await request("post", "api/actions/raffle", {stageId: payload}, operateSuccessFunc)
        },
        async configResult(payload, rootState) {
            let result = await request("post", "api/actions/advance_contestants", payload, operateSuccessFunc)
        },
        async configReward(payload, rootState) {
            let result = await request("put", "sysConfig", payload), operateSuccessFunc
        }
    })
}
