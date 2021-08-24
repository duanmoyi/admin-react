import React, {useState} from 'react';
import {Layout} from 'antd';
import {connect} from "react-redux";
import CustomMenu from "./menu/Menu";

const {Header, Content, Footer, Sider} = Layout;


const Home = props => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <Layout>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}
                   style={{
                       minHeight: '100vh',
                       left: 0,
                   }}
            >
                <CustomMenu/>
            </Sider>
            <Layout className="site-layout" style={{marginLeft: '15px', marginRight: '15px', marginTop: '15px',}}>
                <Content>
                    {props.children}
                </Content>
                <Footer style={{textAlign: 'center'}}>上海渔娱文化有限责任公司 ©2018 Created by uufish.com.cn</Footer>
            </Layout>
        </Layout>
    );
}
const mapState = (state, ownProps) => ({
    ownProps
})

const mapDispatch = (dispatch) => ({})

export default connect(mapState, mapDispatch)(Home);
