import request, {operateSuccessFunc} from "../request/request";
import {defaultPage, tableFetch} from "../utils/core";

export default {
    state: {
        totalData: {
            data: [],
            page: defaultPage
        },
        stageData:[]
    },
    reducers: {
        updateTotalData: (state, payload) => {
            let {totalData, ...other} = state
            return {
                totalData: payload, ...other
            }
        },
        updateStageData: (state, payload) => {
            let {stageData, ...other} = state
            return {
                stageData: payload, ...other
            }
        },
    },
    effects: (dispatch) => ({
        async initTotalData(payload, rootState) {
            let result = await tableFetch(payload, "api2/ranking/contestant", "contestantRankings")
            dispatch.rankInfoConfig.updateTotalData(result)
        },
        async initStageData(payload, rootState) {
            let result = await request("get", "api2/ranking/history" + "?stageId=" + payload)
            debugger
            dispatch.rankInfoConfig.updateStageData(result || [])
        },
    })
}
