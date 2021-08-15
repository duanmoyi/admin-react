import request, {operateSuccessFunc} from "../request/request";

export default {
    state:{
        data:[]
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
            let result = await request("get", "/api/contestants", undefined)
            dispatch.contestantConfigModel.updateData(result && result._embedded && result._embedded.contestants || [])
        },
        async update(payload, rootState) {
            let result = await request("put", "/api/contestants/" + payload.id, payload, operateSuccessFunc)
        },
        async add(payload, rootState) {
            let result = await request("post", "/api/contestants", payload, operateSuccessFunc)
        },
        async delete(payload, rootState) {
            let result = await request("delete", "/api/contestants" + payload, operateSuccessFunc)
        },
    })
}
