import axios from "axios";
import {message} from "antd";
import {navigate} from "@reach/router";

export const operateSuccessFunc = () => {
    message.success("操作成功！")
}
export const loginSuccessPrompt = status => {
    message.success("登录成功！")
}

export const login = async ({username, password}) => {
    try {
        const serverConfig = await getServerConfig()
        let response = await axios({
            method: "post",
            url: "api/login",
            baseURL: serverConfig.apiHost,
            data: "username=" + username + "&password=" + password,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            withCredentials: true,
            timeout: serverConfig.apiRequestTimeout
        })
        if (200 <= response.status && response.status < 300) {
            if (response.data && response.data.code && response.data.code === 401) {
                message.error("登录超时，请重新登录！")
                return
            }
            loginSuccessPrompt(response)
            return response
        } else {
            loginErrorPrompt(response.status)
        }
    } catch (e) {
        if (!e.response) {
            loginErrorPrompt("服务器连接断开")
        } else {
            loginErrorPrompt(e.response.status)
        }
    }
}

export const logout = async () => {
    await request("put", "api/logout", undefined, operateSuccessFunc)
}

export const resetPassword = async data => {
    const serverConfig = await getServerConfig()
    try {
        const response = await axios({
            method: "put",
            url: "api/users/change_password",
            baseURL: serverConfig.apiHost,
            data: data,
            withCredentials: true,
            timeout: serverConfig.apiRequestTimeout
        })
        return response && response.status
    } catch (e) {
        if (!e.response) {
            defaultErrorPrompt("服务器连接断开")
        } else {
            defaultErrorPrompt(e.response.status)
        }
    }
}

export const loginErrorPrompt = status => {
    if (!status) {
        message.error("登录失败，服务异常！")
    }
    switch (status) {
        case 500:
        case 404:
            message.error("登录失败，服务异常！")
            break
        case 401:
            message.error("登录失败，用户名或密码输入错误！")
            break
        default:
            message.error("登录失败，错误：" + status)
    }
}

export const deleteContestantPrompt = async status => {
    if (!status) {
        message.error("服务异常！")
    }
    switch (status) {
        case 500:
        case 409:
            message.error("删除失败，该选手已参与活动！")
            break
        case 404:
            message.error("服务异常！")
            break
        case 401:
            message.error("登录过期，请重新登录！")
            localStorage.removeItem("userInfo")
            await navigate("login")
            break
        case 403:
            message.error("无请求权限！")
            break
        case 400:
            message.error("操作失败，参数错误！")
            break
        default:
            message.error("操作失败，错误：" + status)
    }
}

export const defaultErrorPrompt = async status => {
    if (!status) {
        message.error("服务异常！")
    }
    switch (status) {
        case 500:
        case 404:
            message.error("服务异常！")
            break
        case 401:
            message.error("登录过期，请重新登录！")
            localStorage.removeItem("userInfo")
            await navigate("login")
            break
        case 403:
            message.error("无请求权限！")
            break
        case 400:
            message.error("操作失败，参数错误！")
            break
        default:
            message.error("操作失败，错误：" + status)
    }
}

const loadServerConfig = async () => {
    const response = await axios({
        method: 'get',
        url: 'config/load',
        headers: {},
    })
    if (response.data) {
        return response.data
    }
}

const loadCityData = async () => {
    const response = await axios({
        method: 'get',
        url: 'config/cityData',
        headers: {},
    })
    if (response.data) {
        return response.data
    }
}

export const getRegisterImgUrl = (path) => {
    let host = serverConfig.registerHost
    return host + "/resource/" + path

}

export var serverConfig = {}

export var cityData = []

export const getCityData = async () => {
    if (cityData.length > 0) {
        return cityData
    }
    cityData = await loadCityData()
    return cityData
}

export const getServerConfig = async () => {
    if (serverConfig.apiHost) {
        return serverConfig
    }
    serverConfig = await loadServerConfig()
    return serverConfig
}

export default async function request(method, url, data, successFunc = () => {
}, failFunc = defaultErrorPrompt) {

    const serverConfig = await getServerConfig()
    try {
        const response = await axios({
            method: method,
            url: url,
            baseURL: serverConfig.apiHost,
            data: data ? data : {},
            withCredentials: true,
            timeout: serverConfig.apiRequestTimeout
        })
        if (200 <= response.status && response.status < 300) {
            if (response.data && response.data.code && (response.data.code === 401)) {
                message.error("登录超时，请重新登录！")
                localStorage.removeItem("userInfo")
                await navigate("login")
                return
            }
            successFunc(response)
            return response.data || response
        } else {
            failFunc(response.status)
        }
    } catch (e) {
        if (!e.response) {
            failFunc("服务器连接断开")
        } else {
            failFunc(e.response.status)
        }
    }

}
