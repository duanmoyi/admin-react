import React from "react";
import {UploadOutlined,} from '@ant-design/icons';
import {createBrowserHistory} from "history";
import {navigate} from "@reach/router";

const history = createBrowserHistory()

const layoutMenuData = [{
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
    title: '支付宝会员',
    icon: <UploadOutlined style={{fontSize: '15px'}}/>,
    href: '/userConfig'
// }, {
//     key: 'sysConfig',
//     title: 'sysConfig',
//     icon: <UploadOutlined style={{fontSize: '15px'}}/>,
//     href: '/sysConfig'
}]

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

export default {
    state: {
        selectMenuKey: 'activeRuleConfig',
        menus: layoutMenuData,
        selectMenuData:{
            key: 'activeRuleConfig',
            title: 'activeRuleConfig',
            href: '/activeRuleConfig'
        }
    },
    reducers: {
        update(state, payload) {
            let selectMenuKey = payload
            let selectMenuData = getSelectMenuData(selectMenuKey)

            return {
                selectMenuKey: selectMenuKey,
                menus: layoutMenuData,
                selectMenuData:selectMenuData
            }
        }
    },
    effects: (dispatch) => ({
        async init(payload, rootState) {
            // let selectMenuData = getSelectMenuData(rootState.layoutConfig.selectMenuKey)
            // // payload.history.push(selectMenuData.href)
            // dispatch.layoutConfig.update(rootState.layoutConfig);
        },
        async linkTo(payload, rootState) {
            let selectMenuData = getSelectMenuData(payload)
            dispatch.layoutConfig.update(payload);
            await navigate(selectMenuData.href)
        }
    })
}

