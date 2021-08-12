import React, {Component, useEffect} from 'react';
import {Button, Col, Form, Input, Modal, Row, Select, Table, Tag, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {defaultFormItemLayout} from "../../../utils/formUtils";
import ImgCrop from "antd-img-crop";

const mockData = [{
    username: "吴无物",
    telephone: "17325458652",
    giftName: "wyb签名笔记本",
    giftCategory: "实物奖品",
    activeStageName: "32晋16竞猜活动",
    receiveStatus: "已领取",
    receiveTime: "2021-08-11 15:21:32",
    expressStatus: "已发货",
    expressTime: "2021-08-12 15:21:32",
    expressCode: "SF236688422365655"
}, {
    username: "赵昭昭",
    telephone: "17325458652",
    giftName: "优酷白金会员半年卡",
    giftCategory: "虚拟奖品",
    activeStageName: "32晋16竞猜活动",
    receiveStatus: "已领取",
    receiveTime: "2021-08-11 15:21:32",
}, {
    username: "吴无物",
    telephone: "17325458652",
    giftName: "wyb签名笔记本",
    giftCategory: "实物奖品",
    activeStageName: "32晋16竞猜活动",
    receiveStatus: "未领取",
}, {
    username: "吴无物",
    telephone: "17325458652",
    giftName: "wyb签名笔记本",
    giftCategory: "实物奖品",
    activeStageName: "32晋16竞猜活动",
    receiveStatus: "已领取",
    receiveTime: "2021-08-11 15:21:32",
    expressStatus: "未发货",
}, {
    username: "吴无物",
    telephone: "17325458652",
    giftName: "wyb签名笔记本",
    giftCategory: "实物奖品",
    activeStageName: "32晋16竞猜活动",
    receiveStatus: "已领取",
    receiveTime: "2021-08-11 15:21:32",
}]

const columns = (operateFunc) => [{
    title: '获奖用户',
    dataIndex: 'username',
    key: 'username',
}, {
    title: '用户手机号',
    dataIndex: 'telephone',
    key: 'telephone',
}, {
    title: '奖品名称',
    dataIndex: 'giftName',
    key: 'giftName',
}, {
    title: '奖品类型',
    dataIndex: 'giftCategory',
    key: 'giftCategory',
}, {
    title: '获奖活动',
    dataIndex: 'activeStageName',
    key: 'activeStageName',
}, {
    title: '领取状态',
    dataIndex: 'receiveStatus',
    key: 'receiveStatus',
    render: (value) => value === "已领取" ? <Tag color={"#0a5d1c"}>{value}</Tag> :
        <Tag color={"#e596a8"}>{value}</Tag>
}, {
    title: '领取时间',
    dataIndex: 'receiveTime',
    key: 'receiveTime',
}, {
    title: '发货状态',
    dataIndex: 'expressStatus',
    key: 'expressStatus',
    render: (value, record) => record.giftCategory === "实物奖品" ? value === "已发货" ? <Tag color={"#9ddb8c"}>{value}</Tag> :
        <Tag color={"#515d1b"}>{value}</Tag> : <div/>
}, {
    title: '发货时间',
    dataIndex: 'expressTime',
    key: 'expressTime',
}, {
    title: '物流单号',
    dataIndex: 'expressCode',
    key: 'expressCode',
}, {
    title: '操作列表',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => record.giftCategory === "实物奖品" && record.expressStatus === "未发货" ?
        <a onClick={() => operateFunc.expressFunc(record)}>去发货</a> : <div/>

}]

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
                        <Form.Item name="username" label={"用户名"}>
                            <Input allowClear placeholder="请输入"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="telephone" label={"用户手机号"}>
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
                    <Col span={6}>
                        <Form.Item name="receiveStatus" label={"领取状态"}>
                            <Select>
                                <Select.Option value="virtual">已领取</Select.Option>
                                <Select.Option value="actual">未领取</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="expressStatus" label={"发货状态"}>
                            <Select>
                                <Select.Option value="virtual">已发货</Select.Option>
                                <Select.Option value="actual">未发货</Select.Option>
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

const ExpressForm = ({visible, data, onCancel, submit}) => {
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
            title={"奖品发货"}
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
                <Form.Item name="name" label={"物流单号"} rules={[{
                    required: true,
                    message: '请输入物流单号!',
                }]}>
                    <Input placeholder="请输入物流单号"/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

class GiftRecordPage extends Component {
    state = {
        loading: false,
        modalVisibleState: {expressVisible: false}
    }

    modalViewChange = (modalStateKey, view) => {
        const {...modalVisibleState} = this.state.modalVisibleState
        modalVisibleState[modalStateKey] = view
        this.setState({
            modalVisibleState: modalVisibleState
        })
    }

    express = (data) => {

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
                    <Table style={{marginLeft: '10px'}} loading={this.state.loading}
                           columns={columns({
                               expressFunc: () => this.modalViewChange("expressVisible", true)
                           })}
                           dataSource={mockData}/>
                </div>
                <ExpressForm visible={this.state.modalVisibleState.expressVisible} data={[]}
                             onCancel={() => this.modalViewChange("expressVisible", false)} submit={this.express}/>
            </React.Fragment>
        );
    }
}

export default GiftRecordPage;
