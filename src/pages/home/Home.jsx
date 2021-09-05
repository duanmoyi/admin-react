import React, {useEffect, useState} from 'react';
import {Layout} from 'antd';
import {connect} from "react-redux";
import CustomMenu from "./menu/Menu";
import Header from "./header/Header";
import {navigate} from "@reach/router";

const {Content, Footer, Sider} = Layout;


const Home = props => {
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        if (!props.userInfo.username) {
            navigate("login")
        }
    })

    return (
        <Layout className="layout" style={{height: '100vh'}}>
            <Header style={{background: "rgb(17, 36, 41)"}}/>
            <Layout>
                <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{
                           minHeight: '90vh',
                           left: 0,
                       }}
                >
                    <CustomMenu/>
                </Sider>
                <Layout className="site-layout" style={{marginLeft: '15px', marginRight: '15px', marginTop: '15px',}}>
                    <Content className="site-layout-background" style={{height:"90vh", overflowY:"auto"}}>
                        {props.children}
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Copyright ©2021 上海渔娱文化有限责任公司 ｜ 沪ICP备2021024453号-1</Footer>
                </Layout>
            </Layout>
        </Layout>
    );
}
const mapState = (state, ownProps) => ({
    userInfo: state.loginUserConfig,
    ownProps
})

const mapDispatch = (dispatch) => ({})

export default connect(mapState, mapDispatch)(Home);
