import request, {operateSuccessFunc} from "../request/request";

export default {
    state: {
        data: {}
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
            let result = await request("get", "api/vote_info", undefined)
            dispatch.activeRuleConfigModel.updateData(result || {})
        },
        async update(payload, rootState) {
            let result = await request("put", "api/vote_info", payload, operateSuccessFunc)
        }
    })
}
