import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import ReactDOM from 'react-dom';
import models from "./models";
import {init} from "@rematch/core"
import createLoadingPlugin from '@rematch/loading'
import {Provider} from "react-redux"
import {Router} from "@reach/router";
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import {ConfigProvider, message} from "antd";
import {Login} from "./pages/login";
import {Home} from "./pages/home";
import {ActiveRuleConfig, ActiveStageConfig, GiftConfig, GiftRecord, TicketRecord} from "./pages/active";
import {ContestantConfig, TeamConfig} from "./pages/tourn";
import {SysConfig} from "./pages/sys";
import {UserInfo} from "./pages/user";
import RegisterInfo from "./pages/register/RegisterInfoPage";

const loadingPlugin = createLoadingPlugin({ asNumber: true })

const store = init({
    plugins: [loadingPlugin],
    models,
})

message.config({
    maxCount:1
})

ReactDOM.render(
    <Provider store={store}>
        <ConfigProvider locale={zh_CN}>
            <Router mode="hash">
                <Login path="/login"/>
                <Home path="/">
                    {/*<ActiveRuleConfig default/>
                    <ActiveStageConfig path="/activeStageConfig"/>
                    <GiftConfig path="/giftConfig"/>
                    <GiftRecord path="/giftRecord"/>
                    <TicketRecord path="/ticketRecord"/>
                    <TeamConfig path="/teamConfig"/>
                    <SysConfig path="/sysConfig"/>
                    <UserInfo path="/userConfig"/>
                    <ContestantConfig path="/contestantConfig"/>*/}
                    <RegisterInfo path="/registerInfo" default/>
                </Home>
            </Router>
        </ConfigProvider>
    </Provider>,
    document.getElementById('root')
);
