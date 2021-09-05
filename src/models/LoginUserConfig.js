import {navigate} from "@reach/router";
import {message} from "antd";
import request, {login, logout, resetPassword} from "../request/request";

export const loginUserConfig = {
    state: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : {},
    reducers: {
        update: (state, payload) => {
            return localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : {}
        },
    },
    effects: (dispatch) => ({
        async clear(payload, rootState) {
            localStorage.removeItem("userInfo")
            await navigate("login")
            dispatch.loginUserConfig.update()
        },
        async login(payload, rootState) {
            const result = await login(payload)
            if (result.status === 200) {
                const userInfo = await request("get", "api2/users/user_info")
                if (userInfo) {
                    localStorage.setItem("userInfo", JSON.stringify(userInfo))
                }
                dispatch.loginUserConfig.update()
            } else {
                message.error("登录失败！错误：" + result.status)
            }
        },
        async logout(payload, rootState) {
            let username = rootState.loginUserConfig.username
            await logout(username)
            await this.clear(payload, rootState)
        },
        async timeout(payload, rootState) {
            await this.clear(payload, rootState)
        },
        async resetPassword(payload, rootState) {

            const result = await resetPassword(payload)
            if (result === 202) {
                message.success("操作成功！")
                await this.clear(payload, rootState)
            }
            if (result === 401) {
                message.error("登录超时，请重新登录！")
                await this.clear(payload, rootState)
            }
            if (result === 400) {
                message.error("旧密码输入错误，修改失败！")
            }
        }
    })
}

export default loginUserConfig
