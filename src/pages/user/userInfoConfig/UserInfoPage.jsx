import React, {Component, useEffect, useState} from 'react';
import {
    CommonImgUpload,
    defaultSort,
    getColumnInputSearchProps, getColumnTimeRangeSearchProps,
    getImgUrl,
    imgUploadFunc,
    renderTime, setImg,
    tableChange
} from "../../../utils/core";
import {Button, Col, Form, Image, Input, Modal, Row, Spin, Table} from "antd";
import {Guid} from "js-guid";
import {defaultFormItemLayout} from "../../../utils/formUtils";
import {PlusOutlined} from "@ant-design/icons";
import Password from "antd/es/input/Password";
import {connect} from "react-redux";

const {TextArea} = Input

const columns = (operateFunc, userInfo) => [{
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    render: value => value ? <Image width="48px" src={getImgUrl(value)}/> : <div/>,
}, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    ...getColumnInputSearchProps("姓名")
}, {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    ...getColumnInputSearchProps("用户名")
}, {
    title: '邮箱地址',
    dataIndex: 'email',
    key: 'email',
}, {
    title: '最后登录时间',
    dataIndex: 'lastLogin',
    key: 'lastLogin',
    sorter: true,
    render: renderTime,
    ...getColumnTimeRangeSearchProps()
}, {
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
}, {
    title: '操作',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => <Row gutter={10}>
        <Col>{userInfo.username === record.username ? <a onClick={() => operateFunc.toEdit()}>编辑</a> : <div/>}</Col>
    </Row>
}]

const EditForm = ({visible, data, onCancel, submit}) => {
    const [form] = Form.useForm()
    const [imgFile, setImgFile] = useState([])

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data)
            setImg(data.avatar, setImgFile)
        }else{
            form.resetFields()
            setImgFile([])
        }
    },[data])

    return (
        <Modal
            maskClosable={false}
            visible={visible}
            title={data ? "修改用户信息" : "添加用户信息"}
            okText="提交"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        if (imgFile.length > 0) {
                            let file = imgFile[0]
                            if (file.response) {
                                values.avatar = file.response.data.name
                            } else {
                                values.avatar = file.name
                            }
                        } else {
                            values.avatar = undefined
                        }
                        if (data) {
                            values.id = data.id
                            values.username = data.username
                            values.password = data.password
                            submit(values, 'edit');
                        } else {
                            submit(values, 'add');
                        }
                    }).catch((info) => {
                    console.log('Validate Failed:', info);
                });
            }}>
            <Form
                {...defaultFormItemLayout}
                form={form}>
                <Form.Item name="name" label={"用户姓名"} rules={[{
                    required: true,
                    message: '请输入用户姓名!',
                }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                {!data ? <Form.Item name="username" label={"用户名"} rules={[{
                    required: true,
                    message: '请输入用户名!',
                }]}>
                    <Input placeholder="请输入"/>
                </Form.Item> : <div/>}
                {!data ? <Form.Item name="password" label={"登陆密码"} rules={[{
                    required: true,
                    message: '请输入登陆密码!',
                }]}>
                    <Password placeholder="请输入"/>
                </Form.Item> : <div/>}
                <Form.Item name="email" label={"邮箱地址"}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="avatar" label={"用户头像"}>
                    <CommonImgUpload uploadFunc={imgUploadFunc(setImgFile)} imgFile={imgFile}/>
                </Form.Item>
                <Form.Item name="remarks" label={"备注"}>
                    <TextArea rows={4}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

class UserInfoPage extends Component {

    state = {
        loading: false,
        selectRecord: undefined,
        modalVisibleState: {editVisible: false},
        searchData: {filter: [], sort: [defaultSort], page: this.props.page}
    }

    componentWillMount() {
        this.props.fetch(this.state.searchData)
    }

    modalViewChange = (modalStateKey, view) => {
        const {...modalVisibleState} = this.state.modalVisibleState
        modalVisibleState[modalStateKey] = view
        this.setState({
            modalVisibleState: modalVisibleState
        })
    }

    filterConvert = filters => {
        let result = []
        for (let key in filters) {
            if (!filters[key]) {
                continue
            }

            let operate = "eq"
            switch (key) {
                case "lastLogin":
                    operate = "timeRange"
            }
            result.push({field: key, value: filters[key], type: operate})
        }
        return result
    }
    submit = async (data, mode) => {
        if (mode === "edit") {
            await this.props.update(data)
        } else {
            await this.props.add(data)
        }
        this.modalViewChange("editVisible", false)
        this.props.fetch(this.state.searchData)
        this.setState({selectRecord: undefined})
    }

    render() {
        return (
            <React.Fragment>
                <div className="site-layout-background">
                    <div style={{marginBottom: '10px', marginLeft: '10px'}}>
                        <Button type="primary" icon={<PlusOutlined/>}
                                style={{marginLeft: '10px', marginTop: '20px'}}
                                onClick={() => {
                                    this.setState({selectRecord: undefined})
                                    this.modalViewChange("editVisible", true)
                                }}>添加</Button>
                    </div>
                    <Spin tip={"正在加载。。。"} spinning={this.props.initing > 0 || this.props.loading > 0}>
                        <Table style={{margin: '20px 20px'}} loading={this.state.loading}
                               onChange={(pagination, filters, sorts, extra) => tableChange(pagination, this.filterConvert(filters), sorts, extra, this)}
                               onRow={
                                   record => ({
                                       onClick: event => {
                                           this.setState({selectRecord: record})
                                       },
                                   })
                               }
                               columns={columns({
                                   toEdit: () => {
                                       this.modalViewChange("editVisible", true)
                                   }
                               }, this.props.userInfo)}
                               dataSource={this.props.data}
                               pagination={{...this.props.page}}/>
                    </Spin>
                </div>
                <EditForm visible={this.state.modalVisibleState.editVisible} data={this.state.selectRecord}
                          onCancel={() => this.modalViewChange("editVisible", false)} submit={this.submit}/>
            </React.Fragment>
        );
    }
}

const mapState = (state, ownProps) => ({
    ...state.userInfoConfig,
    initing: state.loading.effects.userInfoConfig.init,
    loading: state.loading.models.userInfoConfig,
    userInfo: state.loginUserConfig,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    fetch: async (data) => {
        await dispatch.userInfoConfig.init(data)
    },
    /*编辑*/
    update: async (data) => {
        await dispatch.userInfoConfig.update(data)
    },
    /*添加*/
    add: async (data) => {
        await dispatch.userInfoConfig.add(data)
    },
    delete: async (data) => {
        await dispatch.userInfoConfig.delete(data)
    },
})

export default connect(mapState, mapDispatch)(UserInfoPage);
