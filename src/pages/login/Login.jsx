import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Alert} from "antd";
import {EditOutlined, UserOutlined} from '@ant-design/icons';
import {Link, navigate} from "@reach/router";
import {connect} from "react-redux";
import {useForm} from "antd/es/form/Form";
import {loginRedirect, loginUser} from "../../utils/core";
import {Footer} from "antd/es/layout/layout";

const LoginPage = (props) => {

    const [form] = Form.useForm()
    const [loginErrorDisplay, setLoginErrorDisplay] = useState("none")
    const [loginErrorMessage, setLoginErrorMessage] = useState("")

    useEffect(() => {
        loginRedirect()
    })

    const login = async () => {
        form.current.validateFields()
            .then(async (values) => {
                await props.login(values)
                await loginRedirect()
            }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    }

    const onkeydown = (e) => {
        if (e.keyCode === 13) {
            login()
        }
    }

    return (
        <div onKeyDown={onkeydown} style={{
            backgroundImage: 'url(LoginBackground.jpg)',
            height: '100vh',
            width: '100%',
            position: "relative",
            background: "white"
        }}>
            <div style={{
                textAlign: "center",
                position: "absolute",
                width: "600px",
                top: "15%",
                left: "50%",
                background: "rgba(255, 255, 255, 0.92)",
                borderRadius: "12px",
                color: "white",
                boxShadow: "rgb(0 0 0 / 8%) 0px 4px 40px",
                transform: "translateX(-50%)"
            }}>
                <div style={{marginTop:"50px"}}>
                    <img src="logo.png" width={150} height={150}/>
                </div>
                <div style={{
                    margin:"0px 0px 20px 0"
                }}>
                    <img src={"loginHeader/渔 动 力 管 理 平 台"} height={36}/>
                </div>
                <div style={{paddingTop: '10px', height: '35vh', width: '100%'}}>
                    <Form
                        ref={form}
                        name="basic"
                        initialValues={{remember: true}}
                    >
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: '请输入用户名!'}]}
                        >
                            <Input placeholder={'用户名'} prefix={<UserOutlined style={{fontSize: 20}}/>}
                                   style={{height: '50px', width: '50%'}}/>
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{required: true, message: '请输入密码!'}]}
                        >
                            <Input.Password placeholder={'密码'} prefix={<EditOutlined style={{fontSize: 20}}/>}
                                            style={{height: '50px', width: '50%'}}/>
                        </Form.Item>

                        <Alert closable style={{"marginBottom": "10px", display: loginErrorDisplay}}
                               message={loginErrorMessage} type="error" showIcon/>
                        <Form.Item>
                            <Button onClick={login} type="primary"
                                    size={'large'}
                                    style={{height: '50px', width: '50%'}}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                    <Footer style={{background: "rgba(255, 255, 255, 0.92)"}}>Copyright ©2021 上海渔娱文化有限责任公司 ｜ 沪ICP备2021024453号-1</Footer>
                </div>
            </div>
        </div>
    );
}

const mapState = (state, ownProps) => ({
    userInfo: state.loginUserConfig,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    login: async (props) => {
        await dispatch.loginUserConfig.login(props)
    }
})

export default connect(mapState, mapDispatch)(LoginPage);
