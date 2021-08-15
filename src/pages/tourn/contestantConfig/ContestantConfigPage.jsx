import React, {Component, useEffect, useState} from 'react';
import {Button, Col, Form, Input, message, Modal, Row, Select, Table, Tag, Radio} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {defaultFormItemLayout} from "../../../utils/formUtils";
import ImgCrop from "antd-img-crop";
import {connect} from "react-redux";
import {Guid} from "js-guid";
import {CommonImgUpload, getImgUrl} from "../../../utils/core";

const {TextArea} = Input

const columns = (operateFunc) => [{
    title: '选手头像',
    dataIndex: 'avatar',
    key: 'avatar',
    render: value => value ? <img style={{width: '32px', height: '48px'}} src={getImgUrl(value)}/> : <div/>
}, {
    title: '选手姓名',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '选手性别',
    dataIndex: 'gender',
    key: 'gender',
}, {
    title: '所属战队',
    dataIndex: 'teamName',
    key: 'teamName',
}, {
    title: '籍贯',
    dataIndex: 'region',
    key: 'region',
}, {
    title: '代表城市',
    dataIndex: 'representRegion',
    key: 'representRegion',
}, {
    title: '当前排名',
    dataIndex: 'orderNum',
    key: 'orderNum',
}, {
    title: '晋级状态',
    dataIndex: 'status',
    key: 'status',
    render: (value, record) => record.status === "已淘汰" ? <Tag color={"#e3e0e2"}>{value}</Tag> :
        <Tag color={"#45e047"}>{value}</Tag>
}, {
    title: '操作列表',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => <Row gutter={10}>
        <Col><a onClick={() => operateFunc.editFunc(record)}>编辑</a></Col>
        <Col>{record.teamName ? <a onClick={() => operateFunc.editTeam(record)}>更换战队</a> :
            <a onClick={() => operateFunc.editTeam(record)}>加入战队</a>}</Col>
    </Row>
}]

const EditTutorForm = ({visible, data, onCancel, submit, teamData}) => {
    const [form] = Form.useForm()

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data)
        } else {
            form.resetFields()
        }
    })

    return (
        <Modal
            maskClosable={false}
            visible={visible}
            title={"更换战队"}
            okText="提交"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        data.teamId = values.teamId
                        delete data.teamName
                        submit(data, 'edit')
                    }).catch((info) => {
                    console.log('Validate Failed:', info);
                });
            }}>
            <Form
                {...defaultFormItemLayout}
                form={form}
            >
                <Form.Item name="teamId" label={"选择战队"} rules={[{
                    required: true,
                    message: '选择战队!',
                }]}>
                    <Select>
                        {teamData.map(m => <Select.Option value={m.teamId}>{m.teamName}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}

const EditForm = ({visible, data, onCancel, submit, teamData}) => {
    const [form] = Form.useForm()
    const [imgFile, setImgFile] = useState([])

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data)
            if (data.avatar) {
                setImgFile([{
                    uid: Guid.newGuid().toString(),
                    name: data.avatar,
                    status: 'done',
                    thumbUrl: getImgUrl(data.avatar),
                    url: getImgUrl(data.avatar),
                }])
            }
        } else {
            form.resetFields()
        }
        return () => {
            form.resetFields()
            setImgFile([])
        }
    }, [data, form])

    const imgUploadFunc = (fileList) => {
        if (fileList.length < 1) {
            setImgFile([])
            return
        }

        let file = fileList[0]
        if (file.status && file.status === "done") {
            if (file.response && !file.response.status === true) {
                message.error("图片上传失败，错误：" + file.response.message)
                return
            }
            setImgFile([file])
        }
    }

    return (
        <Modal
            maskClosable={false}
            visible={visible}
            title={data ? "修改选手信息" : "添加选手信息"}
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
                            values.image = undefined
                        }
                        if (!values.gender) {
                            values.gender = "男"
                        }
                        if (data) {
                            values.status = data.status
                            values.id = data.id
                            submit(values, 'edit')
                        } else {
                            submit(values, 'add');
                        }
                    }).catch((info) => {
                    console.log('Validate Failed:', info);
                });
            }}
            width={"500px"}>
            <Form
                {...defaultFormItemLayout}
                form={form}
            >
                <Form.Item name="name" label={"选手姓名"} rules={[{
                    required: true,
                    message: '请输入选手姓名!',
                }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="gender" label={"性别"}>
                    <Radio.Group defaultValue={"男"}>
                        <Radio value={"男"}>男</Radio>
                        <Radio value={"女"}>女</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="teamId" label={"所属战队"} rules={[{
                    required: true,
                    message: '选择战队!',
                }]}>
                    <Select>
                        {teamData.map(m => <Select.Option value={m.teamId}>{m.teamName}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item name="representRegion" label={"代表城市"} rules={[{
                    required: true,
                    message: '请选择代表区域!',
                }]}>
                    <Select>
                        <Select.Option value="江西">江西</Select.Option>
                        <Select.Option value="浙江">浙江</Select.Option>
                        <Select.Option value="福建">福建</Select.Option>
                        <Select.Option value="广东">广东</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="region" label={"籍贯"} rules={[{
                    required: true,
                    message: '请选择来自区域!',
                }]}>
                    <Select>
                        <Select.Option value="江西">江西</Select.Option>
                        <Select.Option value="浙江">浙江</Select.Option>
                        <Select.Option value="福建">福建</Select.Option>
                        <Select.Option value="广东">广东</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="avatar" label={"选手头像"}>
                    <CommonImgUpload uploadFunc={imgUploadFunc} imgFile={imgFile}/>
                </Form.Item>
                <Form.Item name="specialty" label={"特长描述"}>
                    <TextArea rows={2}/>
                </Form.Item>
                <Form.Item name="remark" label={"其他描述"}>
                    <TextArea rows={2}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

const SearchForm = ({searchFormData, searchFunc}) => {
    const [form] = Form.useForm()

    useEffect(() => {
        if (searchFormData) {
            form.setFieldsValue(searchFormData)
        } else {
            form.resetFields()
        }
    })

    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 19,
        },
    };

    return <Form form={form}{...formItemLayout} style={{marginTop: '10px'}}>
        <Row gutter={20}>
            <Col span={21}>
                <Row gutter={20} justify={"start"}>
                    <Col span={6}>
                        <Form.Item name="username" label={"选手姓名"}>
                            <Input allowClear placeholder="请输入"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="telephone" label={"所属战队"}>
                            <Select>
                                <Select.Option value="virtual">战队1</Select.Option>
                                <Select.Option value="actual">战队2</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="category" label={"晋级状态"}>
                            <Select>
                                <Select.Option value="virtual">已淘汰</Select.Option>
                                <Select.Option value="actual">参赛中</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Col>
            <Col span={3} style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                paddingBottom: '25px',
            }}>
                <Button type="primary" onClick={() => searchFunc(form.getFieldsValue())}>
                    查询
                </Button>
                <Button style={{margin: '0 8px'}} onClick={() => form.resetFields()}>
                    重置
                </Button>
            </Col>
        </Row>
    </Form>
}

class ContestantConfigPage extends Component {
    state = {
        loading: false,
        selectRecord: undefined,
        modalVisibleState: {editVisible: false}
    }


    componentWillMount() {
        this.props.init()
    }

    modalViewChange = (modalStateKey, view) => {
        const {...modalVisibleState} = this.state.modalVisibleState
        modalVisibleState[modalStateKey] = view
        this.setState({
            modalVisibleState: modalVisibleState
        })
    }

    submit = async (data, mode) => {
        if (mode === "edit") {
            await this.props.update(data)
        } else {
            await this.props.add(data)
        }
        this.modalViewChange("editVisible", false)
        this.modalViewChange("editTutorVisible", false)
        this.props.init()
    }

    render() {
        return (
            <React.Fragment>
                <div className="site-layout-background"
                     style={{
                         paddingTop: "10px",
                         marginLeft: '15px',
                         marginRight: '15px',
                         marginTop: '15px',
                         height: '85vh'
                     }}>
                    <div style={{marginRight: '5px', paddingTop: '5px'}}>
                        <SearchForm/>
                    </div>
                    <div style={{marginBottom: '10px', marginLeft: '10px'}}>
                        <Button type="primary" icon={<PlusOutlined/>}
                                style={{marginBottom: '10px', marginLeft: '10px'}}
                                onClick={() => {
                                    this.modalViewChange("editVisible", true)
                                    this.setState({selectRecord: undefined})
                                }}>添加</Button>
                    </div>
                    <Table style={{marginLeft: '10px'}} loading={this.state.loading} rowKey={"id"}
                           onRow={
                               record => ({
                                   onClick: event => {
                                       this.setState({selectRecord: record})
                                   },
                               })
                           }
                           columns={columns({
                               editFunc: () => this.modalViewChange("editVisible", true),
                               editTeam: () => this.modalViewChange("editTutorVisible", true),
                           })}
                           dataSource={this.props.data}/>
                </div>
                <EditForm visible={this.state.modalVisibleState.editVisible} data={this.state.selectRecord}
                          teamData={this.props.teamData}
                          onCancel={() => this.modalViewChange("editVisible", false)} submit={this.submit}/>
                <EditTutorForm visible={this.state.modalVisibleState.editTutorVisible} data={this.state.selectRecord}
                               teamData={this.props.teamData}
                               onCancel={() => this.modalViewChange("editTutorVisible", false)}
                               submit={this.submit}/>
            </React.Fragment>
        );
    }
}

const mapState = (state, ownProps) => ({
    data: state.contestantConfigModel.data,
    teamData: state.teamConfigModel.data,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    init: async (data) => {
        await dispatch.contestantConfigModel.init(data)
        await dispatch.teamConfigModel.init()
    },
    /*编辑*/
    update: async (data) => {
        await dispatch.contestantConfigModel.update(data)
    },
    /*添加*/
    add: async (data) => {
        await dispatch.contestantConfigModel.add(data)
    },
    delete: async (data) => {
        await dispatch.contestantConfigModel.delete(data)
    },
})
export default connect(mapState, mapDispatch)(ContestantConfigPage);
