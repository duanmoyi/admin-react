import React, {Component, useEffect, useState} from 'react';
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Tag, Row, Col, Button, Table, Form, Select, Input, DatePicker, InputNumber, message, Modal, Upload} from "antd";
import {defaultFormItemLayout} from "../../../utils/formUtils";
import ImgCrop from "antd-img-crop";

const {RangePicker} = DatePicker;
const {TextArea} = Input

const mockData = [{
    teamName: "战队1",
    turnName: "wyb",
    remark: "更高更快更强！！！"
}, {
    teamName: "战队1",
    turnName: "wyb",
    remark: "更高更快更强！！！"
}, {
    teamName: "战队1",
    turnName: "wyb",
    remark: "更高更快更强！！！"
}, {
    teamName: "战队1",
    turnName: "wyb",
    remark: "更高更快更强！！！"
}]

const contestantList = [{
    teamName: "吴无物",
    status: "已淘汰",
    order: "前16强"
}, {
    teamName: "吴无物",
    status: "已淘汰",
    order: "前16强"
}, {
    teamName: "吴无物",
    status: "已淘汰",
    order: "前16强"
}, {
    teamName: "吴无物",
    status: "已淘汰",
    order: "前16强"
}, {
    teamName: "吴无物",
    status: "已淘汰",
    order: "前16强"
}, {
    teamName: "吴无物",
    status: "已淘汰",
    order: "前16强"
}, {
    teamName: "吴无物",
    status: "已淘汰",
    order: "前16强"
}]

const columns = (operateFunc) => [{
    title: '战队队标',
    dataIndex: 'picture',
    key: 'picture',
}, {
    title: '战队背景图',
    dataIndex: 'picture',
    key: 'picture',
}, {
    title: '战队名称',
    dataIndex: 'teamName',
    key: 'teamName',
}, {
    title: '战队导师',
    dataIndex: 'turnName',
    key: 'turnName',
}, {
    title: '导师头像',
    dataIndex: 'turnPicture',
    key: 'turnPicture',
}, {
    title: '导师背景图',
    dataIndex: 'turnBackGroundImg',
    key: 'turnBackGroundImg',
}, {
    title: '参赛宣言',
    dataIndex: 'remark',
    key: 'remark',
}, {
    title: '操作列表',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => <Row gutter={10}>
        <Col><a onClick={() => operateFunc.editFunc(record)}>编辑</a></Col>
        <Col><a onClick={() => operateFunc.showContestants(record)}>选手列表</a></Col>
    </Row>
}]

const contestantColumn = [{
    title: '选手照片',
    dataIndex: 'picture',
    key: 'picture',
}, {
    title: '选手姓名',
    dataIndex: 'teamName',
    key: 'teamName',
}, {
    title: '当前晋级状态',
    dataIndex: 'status',
    key: 'status',
}, {
    title: '比赛排名',
    dataIndex: 'order',
    key: 'order',
},]


const ContestantList = ({visible, data, onCancel}) => {
    return <Modal
        maskClosable={false}
        visible={visible}
        title={"奖品详情"}
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
            title={data ? "修改战队信息" : "添加战队信息"}
            okText="提交"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        if (data) {
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
                <Form.Item name="name" label={"战队名称"} rules={[{
                    required: true,
                    message: '请输入战队名称!',
                }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="picture" label={"战队队标"}>
                    <ImgCrop rotate modalTitle="图片裁剪" aspect={2 / 3}>
                        <Upload
                            maxCount={1}
                            method="POST"
                            action="/upload-picture"
                            listType="picture-card"
                        >
                            {'+ 点击上传'}
                        </Upload>
                    </ImgCrop>
                </Form.Item>
                <Form.Item name="picture" label={"战队背景图"}>
                    <ImgCrop rotate modalTitle="图片裁剪" aspect={2 / 3}>
                        <Upload
                            maxCount={1}
                            method="POST"
                            action="/upload-picture"
                            listType="picture-card"
                        >
                            {'+ 点击上传'}
                        </Upload>
                    </ImgCrop>
                </Form.Item> <Form.Item name="name" label={"导师姓名"} rules={[{
                required: true,
                message: '请输入导师姓名!',
            }]}>
                <Input placeholder="请输入"/>
            </Form.Item>
                <Form.Item name="picture" label={"导师头像"}>
                    <ImgCrop rotate modalTitle="图片裁剪" aspect={2 / 3}>
                        <Upload
                            maxCount={1}
                            method="POST"
                            action="/upload-picture"
                            listType="picture-card"
                        >
                            {'+ 点击上传'}
                        </Upload>
                    </ImgCrop>
                </Form.Item>
                <Form.Item name="picture" label={"导师背景图"}>
                    <ImgCrop rotate modalTitle="图片裁剪" aspect={2 / 3}>
                        <Upload
                            maxCount={1}
                            method="POST"
                            action="/upload-picture"
                            listType="picture-card"
                        >
                            {'+ 点击上传'}
                        </Upload>
                    </ImgCrop>
                </Form.Item>
                <Form.Item name="remark" label={"战队宣言"}>
                    <TextArea rows={2}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

class TeamConfigPage extends Component {

    state = {
        loading: false,
        modalVisibleState: {editVisible: false, contestantViewVisible: false}
    }

    modalViewChange = (modalStateKey, view) => {
        const {...modalVisibleState} = this.state.modalVisibleState
        modalVisibleState[modalStateKey] = view
        this.setState({
            modalVisibleState: modalVisibleState
        })
    }

    submit = () => {

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
                                onClick={() => this.modalViewChange("editVisible", true)}>添加</Button>
                    </div>
                    <Table style={{marginLeft: '10px'}} loading={this.state.loading}
                           columns={columns({
                               editFunc: () => this.modalViewChange("editVisible", true),
                               showContestants: () => this.modalViewChange("contestantViewVisible", true),
                           })}
                           dataSource={mockData}/>
                </div>
                <ContestantList onCancel={() => this.modalViewChange("contestantViewVisible", false)}
                                data={contestantList}
                                visible={this.state.modalVisibleState.contestantViewVisible}/>
                <EditForm visible={this.state.modalVisibleState.editVisible} data={[]}
                          onCancel={() => this.modalViewChange("editVisible", false)} submit={this.submit}/>
            </React.Fragment>
        );
    }
}

export default TeamConfigPage;
