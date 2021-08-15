import axios from "axios";
import {message} from "antd";

export const operateSuccessFunc = () => {
    message.success("操作成功！")
}

export const defaultErrorPrompt = status => {
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
        url: '/config/load',
        headers: {},
    })
    if (response.data) {
        return response.data
    }
}

export var serverConfig = {}

export const getServerConfig = async () => {
    if (serverConfig.apiServerHost) {
        return serverConfig
    }
    serverConfig = await loadServerConfig()
    return serverConfig
}

export default async function request(method, url, data, successFunc = () => {
}, failFunc = defaultErrorPrompt) {
    const token = localStorage.getItem("token")
    const header = {Authorization: 'Bearer ' + token}

    const serverConfig = await getServerConfig()
    try {
        const response = await axios({
            method: method,
            url: url,
            baseURL: "http://" + serverConfig.apiServerHost + ":" + serverConfig.apiServerPort,
            data: data ? data : {},
            headers: header,
            timeout: serverConfig.apiRequestTimeout
        })
        if (200 <= response.status && response.status < 300) {
            if (response.data && response.data.code && response.data.code === 401) {
                message.error("登录超时，请重新登录！")
                localStorage.removeItem("userInfo")
                localStorage.removeItem("token")
                // await navigate("/login")
                return
            }
            successFunc(response)
            return response.data
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
