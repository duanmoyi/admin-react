import React from 'react';
import {Layout} from 'antd';
import {connect} from "react-redux";
import CustomMenu from "./menu/Menu";

const {Header, Content, Footer, Sider} = Layout;


const Home = props => {
    return (
        <Layout>
            <Sider
                style={{
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                }}
            >
                <div className="logo">
                    <h2 style={{textAlign: "center", color: "white", paddingBottom: "10px"}}>Admin React</h2>
                </div>
                <CustomMenu/>
            </Sider>
            <Layout className="site-layout" style={{marginLeft: 200}}>
                <Header className="site-layout-background" style={{padding: 0, height: "6vh"}}/>
                <Content style={{height: "90vh", overflowY: "auto"}}>
                    {props.children}
                </Content>
                {/*<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>*/}
            </Layout>
        </Layout>
    );
}
const mapState = (state, ownProps) => ({
    ownProps
})

const mapDispatch = (dispatch) => ({})

export default connect(mapState, mapDispatch)(Home);
