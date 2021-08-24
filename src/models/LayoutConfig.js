import React from "react";
import {UploadOutlined,} from '@ant-design/icons';
import {createBrowserHistory} from "history";
import {navigate} from "@reach/router";

const history = createBrowserHistory()

const layoutMenuData = [
    /*{
        key: 'activeInfo',
        title: '活动信息',
        default: true,
        icon: <UploadOutlined style={{fontSize: '15px'}}/>,
        subMenus: [{
            key: 'activeRuleConfig',
            title: '规则配置',
            href: '/activeRuleConfig'
        }, {
            key: 'activeStageConfig',
            title: '投票配置',
            href: '/activeStageConfig'
        }, {
            key: 'giftConfig',
            title: '奖品配置',
            href: '/giftConfig'
        }, {
            key: 'giftRecord',
            title: '获奖记录',
            href: '/giftRecord'
        }, {
            key: 'ticketRecord',
            title: '投票记录',
            href: '/ticketRecord'
        }]
    }, {
        key: 'tournConfig',
        title: '参赛信息',
        icon: <UploadOutlined style={{fontSize: '15px'}}/>,
        subMenus: [{
            key: 'teamConfig',
            title: '战队信息',
            href: '/teamConfig'
        }, {
            key: 'contestantConfig',
            title: '选手信息',
            href: '/contestantConfig'
        }]
    }, {
        key: 'userInfo',
        title: '会员信息',
        icon: <UploadOutlined style={{fontSize: '15px'}}/>,
        href: '/userConfig'
// }, {
//     key: 'sysConfig',
//     title: 'sysConfig',
//     icon: <UploadOutlined style={{fontSize: '15px'}}/>,
//     href: '/sysConfig'
    },*/ {
        key: 'registerInfo',
        title: '复星老人报名表',
        icon: <UploadOutlined style={{fontSize: '15px'}}/>,
        href: '/registerInfo'
    }].map(m => {
    let key = m.key
    if (m.subMenus) {
        m.subMenus.forEach(n => n.parentMenuKey = key)
    } else {
        m.parentMenuKey = key
    }
    return m
})

const getSelectMenuData = (selectMenuKey) => {
    let matchMenu = layoutMenuData.filter(m => m.key === selectMenuKey)

    if (matchMenu.length > 0) {
        return matchMenu[0]
    }

    let existSubMenu = layoutMenuData.filter(m => m.subMenus)
    let subMenus = []
    existSubMenu.forEach(m => m.subMenus.forEach(n => subMenus.push(n)))
    return subMenus.filter(m => m.key === selectMenuKey)[0]
}

const getSelectMenuKeyByPath = path => {
    let match = layoutMenuData.filter(m => m.href === path)
    if (match.length > 0) {
        return match[0].key
    }

    for (let menuData of layoutMenuData) {
        if (menuData.subMenus && menuData.subMenus.length > 0) {
            match = menuData.subMenus.filter(m => m.href === path)
            if (match.length > 0) {
                break
            }
        }
    }

    if (match.length > 0) {
        return match[0].key
    }
}

export default {
    state: {
        selectMenuKey: 'registerInfo',
        menus: layoutMenuData,
        selectMenuData: {
            key: 'registerInfo',
            title: 'registerInfo',
            href: '/registerInfo'
        }
    },
    reducers: {
        update(state, payload) {
            let selectMenuKey = payload || 'registerInfo'
            let selectMenuData = getSelectMenuData(selectMenuKey)

            return {
                selectMenuKey: selectMenuKey,
                menus: layoutMenuData,
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

