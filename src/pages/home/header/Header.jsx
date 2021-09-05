import React, {useEffect, useState} from 'react';
import {CloseCircleOutlined, EditOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Col, Dropdown, Form, Input, Layout, Menu, Modal, Row, Avatar} from "antd";
import {navigate} from "@reach/router";
import {connect} from "react-redux";
import {getImgUrl} from "../../../utils/core";

const ModifyPasswordForm = ({visible, onSubmit, onCancel}) => {

    const [form] = Form.useForm();

    form.resetFields();

    const layout = {
        labelCol: {
            span: 5,
        },
    };

    return (

        <Modal
            maskClosable={false}
            visible={visible}
            title="修改密码"
            okText="提交"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        onSubmit(values);
                    }).catch((info) => {
                    console.log('Validate Failed:', info);
                });
            }}>
            <Form
                {...layout}
                form={form}
            >
                <Form.Item
                    label="旧密码"
                    name="currentPassword"
                    rules={[{
                        required: true,
                        message: '请输入旧密码!',
                    },
                    ]}
                >
                    <Input.Password style={{width: '60%'}} placeholder={'请输入旧密码'}/>
                </Form.Item>

                <Form.Item
                    label="新密码"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: '请输入新密码!',
                        }, () => ({
                            validator(rule, value) {
                                if (value.length < 6 || value.length > 24) {
                                    return Promise.reject('密码长度范围：6-24');
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input.Password style={{width: '60%'}} placeholder={'请输入新密码'}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const Header = props => {
    useEffect(() => {
        if (!props.userInfo) {
            navigate("login")
        }
        props.init()
    })
    const [modifyPasswordModal, setModifyPasswordModal] = useState(false)

    const showModifyPasswordModal = () => {
        setModifyPasswordModal(true)
    }

    const modifyPasswordCancel = () => {
        setModifyPasswordModal(false)
    }

    const modifyPasswordSubmit = async (data) => {
        await props.resetPassword(data)
    }

    const userOperateMenu = <Menu>
        <Menu.Item onClick={showModifyPasswordModal} icon={<EditOutlined/>} key="1">修改密码</Menu.Item>
        <Menu.Item onClick={async () => await props.logout()} icon={<CloseCircleOutlined/>} key="2">退出登录</Menu.Item>
    </Menu>

    return (
        <Layout.Header style={props.style}>
            <Row>
                <Col span={6}>
                    <div style={{
                        backgroundImage: 'url(/TitleBackgroundImg.png)',
                        height: '60px',
                        width: '450px',
                        marginTop: '5px',
                        marginLeft: '-20px'
                    }}>
                        <Row justify="start">
                            <Col span={3}>
                                <img style={{marginLeft: '10px', marginBottom: '10px'}} src="logo.png" width={60}
                                     height={60}/>
                            </Col>
                            <Col span={21}>
                                <p style={{
                                    marginLeft: '10px',
                                    marginTop: '-2px',
                                    color: 'rgb(226, 224, 213)',
                                    fontSize: '20px',
                                }}>渔动力管理平台</p>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={8}>
                </Col>
                <Col span={10}>
                    <Row justify="end">
                        <Col span={2} style={{
                            paddingLeft: 15
                        }}>{props.userInfo && props.userInfo.avatar ?
                            <Avatar shape="circle" size={48} src={getImgUrl(props.userInfo.avatar)}/> :
                            <Avatar shape="circle" size={48} icon={<UserOutlined/>}/>}
                        </Col>
                        <Col span={2} style={{paddingBottom: 5, paddingLeft: 20}}>
                            <Dropdown onClick={onclick} overlay={userOperateMenu}>
                                <a>
                                    <h1 style={{color: '#ffffff'}}>{props.userInfo.username}</h1>
                                </a>
                            </Dropdown>
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                </Col>
            </Row>
            <ModifyPasswordForm visible={modifyPasswordModal}
                                onCancel={modifyPasswordCancel}
                                onSubmit={modifyPasswordSubmit}/>

        </Layout.Header>
    );
}

const mapState = (state, ownProps) => ({
    userInfo: state.loginUserConfig,
    ownProps
})

const mapDispatch = (dispatch) => ({
    init: () => {
        // dispatch.globalDataConfig.fetchOrgTree()
    },
    resetPassword: async (data) => {
        await dispatch.loginUserConfig.resetPassword(data)
    },
    logout: async () => {
        await dispatch.loginUserConfig.logout()
    }
})

export default connect(mapState, mapDispatch)(Header);
