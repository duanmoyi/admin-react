import React from "react";
import {UploadOutlined, ExclamationCircleOutlined, PicCenterOutlined} from '@ant-design/icons';
import {createBrowserHistory} from "history";
import {navigate} from "@reach/router";

const layoutMenuData = [
    {
        key: 'activeInfo',
        title: '活动信息',
        default: true,
        authority: ["ADMIN", "VOTE_ADMIN"],
        icon: <UploadOutlined style={{fontSize: '15px'}}/>,
        subMenus: [{
            key: 'activeRuleConfig',
            title: '规则配置',
            href: 'activeRuleConfig'
        }, {
            key: 'activeStageConfig',
            title: '投票配置',
            href: 'activeStageConfig'
        }, {
            key: 'giftConfig',
            title: '奖品配置',
            href: 'giftConfig'
        }, {
            key: 'giftRecord',
            title: '获奖记录',
            href: 'giftRecord'
        }, {
            key: 'ticketRecord',
            title: '投票记录',
            href: 'ticketRecord'
        }]
    }, {
        key: 'tournConfig',
        title: '参赛信息',
        authority: ["ADMIN", "VOTE_ADMIN"],
        icon: <UploadOutlined style={{fontSize: '15px'}}/>,
        subMenus: [{
            key: 'teamConfig',
            title: '战队信息',
            href: 'teamConfig'
        }, {
            key: 'contestantConfig',
            title: '选手信息',
            href: 'contestantConfig'
        }, {
            key: 'ranking',
            title: '人气排名',
            href: 'ranking'
        }]
    }, {
        key: 'memberInfo',
        title: '会员信息',
        authority: ["ADMIN", "VOTE_ADMIN"],
        icon: <UploadOutlined style={{fontSize: '15px'}}/>,
        href: 'memberConfig'
    }, {
        key: 'userInfo',
        title: '用户管理',
        authority: ["ADMIN"],
        icon: <UploadOutlined style={{fontSize: '15px'}}/>,
        href: 'userInfo'
    }, {
        key: 'registerInfo',
        title: '复星康养星潮达人',
        authority: ["ADMIN", "REGISTER_ADMIN"],
        icon: <PicCenterOutlined style={{fontSize: '15px'}}/>,
        href: 'registerInfo'
// }, {
//     key: 'sysConfig',
//     title: 'sysConfig',
//     icon: <UploadOutlined style={{fontSize: '15px'}}/>,
//     href: '/sysConfig'
    }].map(m => {
    let key = m.key
    if (m.subMenus) {
        m.subMenus.forEach(n => n.parentMenuKey = key)
    } else {
        m.parentMenuKey = key
    }
    return m
})

const getLayoutMenuData = () => {
    let loginUser = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : {}
    if (!loginUser.roles || loginUser.roles.length < 1) {
        return []
    }

    return layoutMenuData.filter(m => m.authority.filter(n => n.includes(loginUser.roles)).length > 0)
    // return layoutMenuData
}

const getSelectMenuData = (selectMenuKey) => {
    if (!selectMenuKey) {
        return undefined
    }
    let matchMenu = getLayoutMenuData().filter(m => m.key === selectMenuKey)

    if (matchMenu.length > 0) {
        return matchMenu[0]
    }

    let existSubMenu = getLayoutMenuData().filter(m => m.subMenus)
    let subMenus = []
    existSubMenu.forEach(m => m.subMenus.forEach(n => subMenus.push(n)))
    return subMenus.filter(m => m.key === selectMenuKey)[0]
}

const getSelectMenuKeyByPath = path => {
    let match = getLayoutMenuData().filter(m => "/registrations/" + m.href === path)
    if (match.length > 0) {
        return match[0].key
    }

    for (let menuData of getLayoutMenuData()) {
        if (menuData.subMenus && menuData.subMenus.length > 0) {
            match = menuData.subMenus.filter(m => "/registrations/" + m.href === path)
            if (match.length > 0) {
                break
            }
        }
    }

    if (match.length > 0) {
        return match[0].key
    }
}

const getDefaultMenuData = () => {
    let menuData = getLayoutMenuData()
    if (menuData.length === 0) {
        return {
            selectMenuKey: "",
            menus: menuData,
            selectMenuData: {
                key: '',
                title: '',
                href: ''
            }
        }
    }

    let defaultMenuData = menuData[0]
    if (defaultMenuData.subMenus && defaultMenuData.subMenus.length > 0) {
        return defaultMenuData.subMenus[0]
    }
    return defaultMenuData[0]
}

export default {
    state: {
        menus: getLayoutMenuData(),
    },
    reducers: {
        update(state, payload) {
            let selectMenuKey = payload
            let selectMenuData = getSelectMenuData(selectMenuKey)
            if (!selectMenuData) {
                let defaultMenuData = getDefaultMenuData()
                return {
                    selectMenuKey: defaultMenuData.key,
                    menus: getLayoutMenuData(),
                    selectMenuData: defaultMenuData
                }
            }

            return {
                selectMenuKey: selectMenuKey,
                menus: getLayoutMenuData(),
                selectMenuData: selectMenuData
            }
        }
    },
    effects: (dispatch) => ({
        async init(payload, rootState) {
            let path = window.location.pathname
            let selectMenuKey = getSelectMenuKeyByPath(path)
            dispatch.layoutConfig.update(selectMenuKey);
        },
        async linkTo(payload, rootState) {
            let selectMenuData = getSelectMenuData(payload)
            dispatch.layoutConfig.update(payload);
            await navigate(selectMenuData.href)
        }
    })
}

