import React, {Component, useEffect} from 'react';
import {Button, Col, Form, Input, Modal, Row, Select, Table, Tag, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {defaultFormItemLayout} from "../../../utils/formUtils";
import ImgCrop from "antd-img-crop";

const {TextArea} = Input

const mockData = [{
    id:"1",
    name:"阿毛",
    fromArea:"广东深圳",
    delegateArea:"浙江杭州",
    orderNum:"前16强",
    status:"已淘汰",
    teamName:"战队1"
},{
    id:"2",
    name:"阿毛",
    fromArea:"广东深圳",
    delegateArea:"浙江杭州",
    orderNum:"前16强",
    status:"正在参赛"
},{
    id:"3",
    name:"阿毛",
    fromArea:"广东深圳",
    delegateArea:"浙江杭州",
    orderNum:"前16强",
    status:"正在参赛",
    teamName:"战队3"
},{
    id:"4",
    name:"阿毛",
    fromArea:"广东深圳",
    delegateArea:"浙江杭州",
    orderNum:"前16强",
    status:"正在参赛"
},{
    id:"5",
    name:"阿毛",
    fromArea:"广东深圳",
    delegateArea:"浙江杭州",
    orderNum:"前16强",
    status:"正在参赛"
}]

const columns = (operateFunc) => [{
    title: '选手头像',
    dataIndex: 'picture',
    key: 'picture',
}, {
    title: '背景图',
    dataIndex: 'backgroundImg',
    key: 'backgroundImg',
}, {
    title: '选手姓名',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '所属战队',
    dataIndex: 'teamName',
    key: 'teamName',
}, {
    title: '来自区域',
    dataIndex: 'fromArea',
    key: 'fromArea',
}, {
    title: '代表区域',
    dataIndex: 'delegateArea',
    key: 'delegateArea',
}, {
    title: '当前排名',
    dataIndex: 'orderNum',
    key: 'orderNum',
}, {
    title: '晋级状态',
    dataIndex: 'status',
    key: 'status',
    render: (value, record) => record.status === "已淘汰"  ? <Tag color={"#e3e0e2"}>{value}</Tag> :
        <Tag color={"#45e047"}>{value}</Tag>
}, {
    title: '操作列表',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => <Row gutter={10}>
        <Col><a onClick={() => operateFunc.editFunc(record)}>编辑</a></Col>
        <Col>{record.teamName ? <a onClick={() => operateFunc.editTeam(record)}>更换战队</a> :
            <a onClick={() => operateFunc.editTeam(record)}>加入战队</a>}</Col>
        <Col>{record.status === "已淘汰" ? <a onClick={() => operateFunc.recovery(record)}>复活</a> :
            <a onClick={() => operateFunc.levelUp(record)}>晋级下一轮</a>}</Col>
    </Row>
}]

const EditTutorForm = ({visible, data, onCancel, submit}) => {
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
                        submit(values)
                    }).catch((info) => {
                    console.log('Validate Failed:', info);
                });
            }}>
            <Form
                {...defaultFormItemLayout}
                form={form}
            >
                <Form.Item name="name" label={"选择加入的战队"} rules={[{
                    required: true,
                    message: '选择加入的战队!',
                }]}>
                    <Select>
                        <Select.Option value="waitStart">战队1</Select.Option>
                        <Select.Option value="starting">战队2</Select.Option>
                        <Select.Option value="starting">战队3</Select.Option>
                        <Select.Option value="starting">战队4</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
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
            title={data ? "修改选手信息" : "添加选手信息"}
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
                <Form.Item name="name" label={"选手姓名"} rules={[{
                    required: true,
                    message: '请输入选手姓名!',
                }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="name" label={"代表区域"} rules={[{
                    required: true,
                    message: '请选择代表区域!',
                }]}>
                    <Select>
                        <Select.Option value="waitStart">江西</Select.Option>
                        <Select.Option value="starting">浙江</Select.Option>
                        <Select.Option value="starting">福建</Select.Option>
                        <Select.Option value="starting">广东</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="name" label={"来自区域"} rules={[{
                    required: true,
                    message: '请选择来自区域!',
                }]}>
                    <Select>
                        <Select.Option value="waitStart">江西</Select.Option>
                        <Select.Option value="starting">浙江</Select.Option>
                        <Select.Option value="starting">福建</Select.Option>
                        <Select.Option value="starting">广东</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="picture" label={"选手头像"}>
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
                <Form.Item name="picture" label={"选手背景图"}>
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
                <Form.Item name="remark" label={"特长描述"}>
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

class ContestantConfgPage extends Component {
    state = {
        loading: false,
        modalVisibleState: {editVisible: false}
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
                    <div style={{marginRight: '5px', paddingTop: '5px'}}>
                        <SearchForm/>
                    </div>
                    <div style={{marginBottom: '10px', marginLeft: '10px'}}>
                        <Button type="primary" icon={<PlusOutlined/>}
                                style={{marginBottom: '10px', marginLeft: '10px'}}
                                onClick={() => this.modalViewChange("editVisible", true)}>添加</Button>
                    </div>
                    <Table style={{marginLeft: '10px'}} loading={this.state.loading}
                           columns={columns({
                               editFunc: () => this.modalViewChange("editVisible", true),
                               editTeam: () => this.modalViewChange("editTutorVisible", true),
                           })}
                           dataSource={mockData}/>
                </div>
                <EditForm visible={this.state.modalVisibleState.editVisible} data={[]}
                          onCancel={() => this.modalViewChange("editVisible", false)} submit={this.submit}/>
                <EditTutorForm visible={this.state.modalVisibleState.editTutorVisible} data={[]}
                               onCancel={() => this.modalViewChange("editTutorVisible", false)}
                               submit={this.editTutorVisible}/>
            </React.Fragment>
        );
    }
}

export default ContestantConfgPage;
