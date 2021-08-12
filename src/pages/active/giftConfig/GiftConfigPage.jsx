import React, {Component, useEffect, useState} from 'react';
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Tag, Row, Col, Button, Table, Form, Select, Input, DatePicker, InputNumber, message, Modal, Upload} from "antd";
import {defaultFormItemLayout} from "../../../utils/formUtils";
import ImgCrop from "antd-img-crop";

const {TextArea} = Input

const mockData = [{
    id: "1",
    name: "优酷会员半年卡",
    category: "虚拟奖品",
}, {
    id: "2",
    name: "wyb签名笔记本",
    category: "实物奖品",
}]

const columns = (operateFunc) => [{
    title: '图片',
    dataIndex: 'picture',
    key: 'picture',
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '奖品类型',
    dataIndex: 'category',
    key: 'category',
    render: value => value === "虚拟奖品" ? <Tag color={"#F56955"}>{value}</Tag> : <Tag color={"#338c98"}>{value}</Tag>
}, {
    title: '操作列表',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => (record.category === "虚拟奖品" ?
        <a onClick={() => operateFunc.showGiftList(record)}>查看领取信息</a> : <div/>)
}]

const giftListData = [{
    code: "a225SF-221ded-SDS223-DD1412",
    status: "已领取",
    people: "吴无物",
    time: "2021-08-11 12:15:51",
    activeStageName: "32晋16竞猜活动"
}, {
    code: "a225SF-221ded-SDS223-DD1412",
    status: "未领取",
    people: "",
    time: "",
    activeStageName: ""
}, {
    code: "a225SF-221ded-SDS223-DD1412",
    status: "未领取",
    people: "",
    time: "",
    activeStageName: ""
}, {
    code: "a225SF-221ded-SDS223-DD1412",
    status: "已领取",
    people: "吴无物",
    time: "2021-08-11 12:15:51",
    activeStageName: "32晋16竞猜活动"
}, {
    code: "a225SF-221ded-SDS223-DD1412",
    status: "未领取",
    people: "",
    time: "",
    activeStageName: ""
}, {
    code: "a225SF-221ded-SDS223-DD1412",
    status: "已领取",
    people: "吴无物",
    time: "2021-08-11 12:15:51",
    activeStageName: "32晋16竞猜活动"
}, {
    code: "a225SF-221ded-SDS223-DD1412",
    status: "未领取",
    people: "",
    time: "",
    activeStageName: ""
}, {
    code: "a225SF-221ded-SDS223-DD1412",
    status: "已领取",
    people: "吴无物",
    time: "2021-08-11 12:15:51",
    activeStageName: "32晋16竞猜活动"
},]

const giftListColumns = [{
    title: '兑换码',
    dataIndex: 'code',
    key: 'code',
}, {
    title: '领取状态',
    dataIndex: 'status',
    key: 'status',
    render: value => value === "已领取" ? <Tag color={"green"}>{value}</Tag> : <Tag color={"red"}>{value}</Tag>
}, {
    title: '领取人',
    dataIndex: 'people',
    key: 'people',
}, {
    title: '领取时间',
    dataIndex: 'time',
    key: 'time',
}, {
    title: '关联活动',
    dataIndex: 'activeStageName',
    key: 'activeStageName',
}]

const GiftList = ({visible, data, onCancel}) => {
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
            columns={giftListColumns}
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
            title={data ? "修改奖品信息" : "添加奖品信息"}
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
                <Form.Item name="name" label={"奖品名称"} rules={[{
                    required: true,
                    message: '请输入奖品名称!',
                }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="name" label={"奖品类型"} rules={[{
                    required: true,
                    message: '请选择奖品类型!',
                }]}>
                    <Select>
                        <Select.Option value="waitStart">虚拟奖品</Select.Option>
                        <Select.Option value="starting">实物奖品</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="picture" label={"奖品图片"}>
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
                <Form.Item name="remark" label={"备注"}>
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
                        <Form.Item name="name" label={"名称"}>
                            <Input allowClear placeholder="请输入"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="category" label={"奖品类型"}>
                            <Select>
                                <Select.Option value="virtual">虚拟奖品</Select.Option>
                                <Select.Option value="actual">实物奖品</Select.Option>
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

class GiftConfigPage extends Component {

    state = {
        loading: false,
        selectRecord: undefined,
        modalVisibleState: {editVisible: false, giftListShowVisible: false}
    }

    modalViewChange = (modalStateKey, view) => {
        const {...modalVisibleState} = this.state.modalVisibleState
        modalVisibleState[modalStateKey] = view
        this.setState({
            modalVisibleState: modalVisibleState
        })
    }

    onChange = (selectedRowKeys, selectedRows) => {
        this.setState({selectRecord: selectedRows[0]})
    }

    submit = () => {

    }

    importDetail = () => {

    }

    enableOperate = {
        edit: () => this.state.selectRecord,
        importDetail: () => this.state.selectRecord && this.state.selectRecord.category === "虚拟奖品",
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
                        <Row gutter={10}>
                            <Col>
                                <Button type="primary" icon={<PlusOutlined/>}
                                        style={{marginBottom: '10px'}}
                                        onClick={() => this.modalViewChange("editVisible", true)}>添加</Button>
                            </Col>
                            {this.enableOperate.edit() ? <Col>
                                <Button icon={<PlusOutlined/>}
                                        style={{marginBottom: '10px'}}
                                        type="primary"
                                        onClick={() => this.modalViewChange("editVisible", true)}>编辑</Button>
                            </Col> : <div/>}
                            {this.enableOperate.importDetail() ? <Col>
                                <Button icon={<PlusOutlined/>}
                                        style={{marginBottom: '10px'}}
                                        type="primary"
                                        onClick={this.importDetail}>导入兑换码</Button>
                            </Col> : <div/>}
                        </Row>
                    </div>
                    <Table style={{marginLeft: '10px'}} loading={this.state.loading}
                           rowKey={"id"}
                           rowSelection={{
                               type: "radio",
                               onChange: this.onChange,
                               selectedRowKeys: (this.state.selectRecord && this.state.selectRecord.id) ? [this.state.selectRecord.id] : []
                           }}
                           onRow={
                               record => ({
                                   onClick: event => {
                                       this.setState({selectRecord: record})
                                   },
                               })
                           }
                           columns={columns({
                               showGiftList: () => this.modalViewChange("giftListShowVisible", true),
                           })}
                           dataSource={mockData}/>
                </div>
                <GiftList onCancel={() => this.modalViewChange("giftListShowVisible", false)} data={giftListData}
                          visible={this.state.modalVisibleState.giftListShowVisible}/>
                <EditForm visible={this.state.modalVisibleState.editVisible} data={[]}
                          onCancel={() => this.modalViewChange("editVisible", false)} submit={this.submit}/>
            </React.Fragment>
        );
    }
}

export default GiftConfigPage;
