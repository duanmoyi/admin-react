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
            let result = await request("get", "api/tutor_extended", undefined)
            dispatch.teamConfigModel.updateData(result && result._embedded && result._embedded.tutorExtendedInfoes || [])
        },
        async update(payload, rootState) {
            let result = await request("put", "api/tutor_extended/" + payload.id, payload, operateSuccessFunc)
        },
        async add(payload, rootState) {
            let result = await request("post", "api/tutor_extended", payload, operateSuccessFunc)
        },
        async delete(payload, rootState) {
            let result = await request("delete", "api/tutor_extended" + payload, operateSuccessFunc)
        },
    })
}
