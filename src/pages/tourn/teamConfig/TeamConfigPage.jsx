import React, {Component, useEffect, useState} from 'react';
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Tag, Row, Col, Button, Table, Form, Select, Input, DatePicker, InputNumber, message, Modal, Upload} from "antd";
import {defaultFormItemLayout} from "../../../utils/formUtils";
import ImgCrop from "antd-img-crop";
import {connect} from "react-redux";
import {CommonImgUpload, getImgUrl} from "../../../utils/core";
import {Guid} from "js-guid";
import request from "../../../request/request";

const {RangePicker} = DatePicker;
const {TextArea} = Input

const columns = (operateFunc) => [{
    title: '战队头像',
    dataIndex: 'teamAvatar',
    key: 'teamAvatar',
    render: value => value ? <img style={{width: '32px', height: '48px'}} src={getImgUrl(value)}/> : <div/>
}, {
    title: '战队名称',
    dataIndex: 'teamName',
    key: 'teamName',
}, {
    title: '战队导师',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '导师头像',
    dataIndex: 'avatar',
    key: 'avatar',
    render: value => value ? <img style={{width: '32px', height: '48px'}} src={getImgUrl(value)}/> : <div/>
}, {
    title: '战队口号',
    dataIndex: 'teamSlogan',
    key: 'teamSlogan',
}, {
    title: '操作列表',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => <Row gutter={10}>
        <Col><a onClick={() => operateFunc.editFunc(record)}>编辑</a></Col>
        <Col><a onClick={() => operateFunc.showContestants(record.teamId)}>选手列表</a></Col>
    </Row>
}]

const contestantColumn = [{
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
},]


const ContestantList = ({visible, data, onCancel}) => {
    return <Modal
        maskClosable={false}
        visible={visible}
        title={"选手列表"}
        okText="确定"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onCancel}
        width={"1000px"}>
        <Table
            dataSource={data}
            columns={contestantColumn}
        />
    </Modal>
}

const EditForm = ({visible, data, onCancel, submit}) => {
    const [form] = Form.useForm()
    const [tutorImgFile, setTutorImgFile] = useState([])
    const [teamImgFile, setTeamImgFile] = useState([])

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data)
            if (data.avatar) {
                setTutorImgFile([{
                    uid: Guid.newGuid().toString(),
                    name: data.avatar,
                    status: 'done',
                    thumbUrl: getImgUrl(data.avatar),
                    url: getImgUrl(data.avatar),
                }])
            }
            if (data.teamAvatar) {
                setTeamImgFile([{
                    uid: Guid.newGuid().toString(),
                    name: data.teamAvatar,
                    status: 'done',
                    thumbUrl: getImgUrl(data.teamAvatar),
                    url: getImgUrl(data.teamAvatar),
                }])
            }
        }
        return () => {
            form.resetFields()
            setTutorImgFile([])
            setTeamImgFile([])
        }
    }, [data, form])

    const imgUploadFunc = (fileList, setFunc) => {
        if (fileList.length < 1) {
            setFunc([])
            return
        }

        let file = fileList[0]
        if (file.status && file.status === "done") {
            if (file.response && !file.response.status === true) {
                message.error("图片上传失败，错误：" + file.response.message)
                return
            }
            setFunc([file])
        }
    }

    return (
        <Modal
            maskClosable={false}
            visible={visible}
            title={data ? "修改战队信息" : "添加战队信息"}
            okText="提交"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        if (tutorImgFile.length > 0) {
                            let file = tutorImgFile[0]
                            if (file.response) {
                                values.avatar = file.response.data.name
                            } else {
                                values.avatar = file.name
                            }
                        } else {
                            values.avatar = undefined
                        }
                        if (teamImgFile.length > 0) {
                            let file = teamImgFile[0]
                            if (file.response) {
                                values.teamAvatar = file.response.data.name
                            } else {
                                values.teamAvatar = file.name
                            }
                        } else {
                            values.teamAvatar = undefined
                        }
                        if (data) {
                            values.id = data.id
                            values.teamId = data.teamId
                            submit(values, 'edit');
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
                <Form.Item name="teamName" label={"战队名称"} rules={[{
                    required: true,
                    message: '请输入战队名称!',
                }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="teamAvatar" label={"战队头像"}>
                    <CommonImgUpload uploadFunc={fileList => imgUploadFunc(fileList, setTeamImgFile)}
                                     imgFile={teamImgFile}/>
                </Form.Item>
                <Form.Item name="name" label={"导师姓名"} rules={[{
                    required: true,
                    message: '请输入导师姓名!',
                }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="avatar" label={"导师头像"}>
                    <CommonImgUpload uploadFunc={fileList => imgUploadFunc(fileList, setTutorImgFile)}
                                     imgFile={tutorImgFile}/>
                </Form.Item>
                <Form.Item name="teamSlogan" label={"参赛口号"}>
                    <TextArea rows={2}/>
                </Form.Item>
                <Form.Item name="details" label={"导师信息描述"}>
                    <TextArea rows={2}/>
                </Form.Item>
                <Form.Item name="teamDetails" label={"战队信息描述"}>
                    <TextArea rows={2}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

class TeamConfigPage extends Component {

    state = {
        loading: false,
        selectRecord: undefined,
        contestantData: [],
        modalVisibleState: {editVisible: false, contestantViewVisible: false}
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
        this.props.init()
    }

    viewContestantList = async (teamId) => {
        let data = await request("get", "/api/contestants?teamId=" + teamId)
        this.setState({
            contestantData: data && data._embedded && data._embedded.contestants || []
        })
        this.modalViewChange("contestantViewVisible", true)
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
                    <div style={{marginBottom: '10px', marginLeft: '10px'}}>
                        <Button type="primary" icon={<PlusOutlined/>}
                                style={{marginBottom: '10px', marginLeft: '10px'}}
                                onClick={() => {
                                    this.modalViewChange("editVisible", true)
                                    this.setState({selectRecord: undefined})
                                }}>添加</Button>
                    </div>
                    <Table style={{marginLeft: '10px'}} loading={this.state.loading}
                           onRow={
                               record => ({
                                   onClick: event => {
                                       this.setState({selectRecord: record})
                                   },
                               })
                           }
                           columns={columns({
                               editFunc: () => this.modalViewChange("editVisible", true),
                               showContestants: this.viewContestantList,
                           })}
                           dataSource={this.props.data}/>
                </div>
                <ContestantList onCancel={() => this.modalViewChange("contestantViewVisible", false)}
                                data={this.state.contestantData}
                                visible={this.state.modalVisibleState.contestantViewVisible}/>
                <EditForm visible={this.state.modalVisibleState.editVisible} data={this.state.selectRecord}
                          onCancel={() => this.modalViewChange("editVisible", false)} submit={this.submit}/>
            </React.Fragment>
        );
    }
}

const mapState = (state, ownProps) => ({
    data: state.teamConfigModel.data,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    init: async (data) => {
        await dispatch.teamConfigModel.init(data)
    },
    /*编辑*/
    update: async (data) => {
        await dispatch.teamConfigModel.update(data)
    },
    /*添加*/
    add: async (data) => {
        await dispatch.teamConfigModel.add(data)
    },
    delete: async (data) => {
        await dispatch.teamConfigModel.delete(data)
    },
})
export default connect(mapState, mapDispatch)(TeamConfigPage);
