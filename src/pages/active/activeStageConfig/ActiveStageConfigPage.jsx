import React, {Component, useEffect, useState} from 'react';
import {PlusOutlined} from "@ant-design/icons";
import {Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select, Table, Tag} from "antd";
import {defaultFormItemLayout} from "../../../utils/formUtils";
import GiftRecordPage from "../giftRecord";

const {RangePicker} = DatePicker;
const {TextArea} = Input

const preminumColumn = [{
    title: '奖品图片',
    dataIndex: 'picture',
    key: 'picture',
}, {
    title: '奖品名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '发放数量',
    dataIndex: 'count',
    key: 'count',
    render: (value, record) => (
        <Form.Item
            style={{
                margin: 0,
            }}
            name='transferCount'
            rules={[
                {
                    required: true,
                    message: `请设置发放数量！`,
                },
            ]}
        >
            <InputNumber onChange={(data) => record.count = data} value={record.count}
                         defaultValue={record.count || 0} min={0} placeholder="请输入"/>
        </Form.Item>
    )
},]

const preminumDatas = [{
    id: 1,
    name: "优酷白金会员月卡",
    count: 300
}, {
    id: 2,
    name: "wyb签名笔记本",
    count: 500
}]

const preminumList = [{
    id: 1,
    name: "优酷白金会员月卡",
}, {
    id: 2,
    name: "wyb签名笔记本",
}, {
    id: 3,
    name: "饿了么超级会员年卡",
}, {
    id: 4,
    name: "淘票票满99减98电影券",
}, {
    id: 5,
    name: "网易云黑金会员年卡",
}]

const mockData = [{
    id: 1,
    name: "全国32强晋级赛",
    beginTime: "2021-08-31 20:00:00",
    endTime: "2021-09-06 20:00:00",
    status: "已结束",
}, {
    id: 2,
    name: "32-20强晋级赛",
    beginTime: "2021-09-13 20:00:00",
    endTime: "2021-09-20 20:00:00",
    status: "正在进行",
}, {
    id: 3,
    name: "20强复活赛",
    beginTime: "2021-09-27 20:00:00",
    endTime: "2021-10-04 20:00:00",
    status: "未开始",
}]

const columns = (operateFunc) => [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '开始时间',
    dataIndex: 'beginTime',
    key: 'beginTime',
}, {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
}, {
    title: '当前状态',
    dataIndex: 'status',
    key: 'status',
    render: value => value ? value === "正在进行" ? <Tag color="#87d068">{value}</Tag> : value === "未开始" ?
        <Tag color="#023214">{value}</Tag> : <Tag color="#f50">{value}</Tag> : <div/>
}, {
    title: '获奖记录',
    dataIndex: 'id',
    key: 'id',
    render: value => <a onClick={operateFunc.viewRewardRecord}>点击查看</a>
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
                        <Form.Item name="name" label={"名称"}>
                            <Input allowClear placeholder="请输入"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="name" label={"状态"}>
                            <Select>
                                <Select.Option value="waitStart">未开始</Select.Option>
                                <Select.Option value="starting">正在进行</Select.Option>
                                <Select.Option value="stoped">已结束</Select.Option>
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

const EditForm = ({data, visible, submit, onCancel}) => {
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
            title={data ? "修改投票活动" : "添加投票活动"}
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
                <Form.Item name="name" label={"活动名称"} rules={[{
                    required: true,
                    message: '请输入活动名称!',
                }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="contacts" label={"开启时间"}>
                    <RangePicker format={"YYYY-MM-DD"} allowClear/>
                </Form.Item>
                <Form.Item name="telephone" label={"结束时间"}>
                    <RangePicker format={"YYYY-MM-DD"} allowClear/>
                </Form.Item>
                <Form.Item name="remark" label={"备注"}>
                    <TextArea rows={2}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

const PremiumView = ({data, visible, onCancel}) => {
    return <Modal
        maskClosable={false}
        visible={visible}
        title={"下发奖品"}
        okText="提交"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onCancel}
        width={"1000px"}>
        <Table
            dataSource={data}
            columns={preminumColumn}
        />
    </Modal>
}

const GiftRecord = ({data, visible, onCancel}) => {
    return <Modal
        maskClosable={false}
        visible={visible}
        title={"获奖信息"}
        footer={null}
        onCancel={onCancel}
        width={"1500px"}>
        <GiftRecordPage stageId={data}/>
    </Modal>
}

const PremiumConfig = (props) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectRowKeys, setSelectRowKeys] = useState([]);
    const [data, setData] = useState([])

    useEffect(() => {
        if (props.premiumList) {
            let data = props.data || []
            props.premiumList.forEach(m => {
                let match = data.filter(n => n.id === m.id)
                if (match.length > 0) {
                    m.count = match[0].count
                } else {
                    m.count = 0
                }
            })

            setSelectRowKeys(props.data.filter(m => m.count > 0).map(m => m.id))
            setSelectedRows(props.data.filter(m => m.count > 0))
            setData(props.data)
        }
    }, [props.data, props.params],)

    const submit = () => {
        if (!selectedRows || selectedRows.length < 1) {
            message.warn("请选择下发奖品！")
        } else {
            props.submit(selectedRows)
            props.onCancel()
        }
    }

    const rowSelection = {
        selectRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows)
            setSelectRowKeys(selectedRowKeys)
        },
    };

    return <Modal
        maskClosable={false}
        visible={props.visible}
        title={"配置下发奖品"}
        okText="提交"
        cancelText="取消"
        onCancel={props.onCancel}
        onOk={submit}
        width={"1000px"}>
        <Table
            rowKey={(value) => value.id}
            size="small"
            rowSelection={{
                selectedRowKeys: selectRowKeys,
                type: 'checkbox',
                ...rowSelection,
            }}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={props.premiumList}
            columns={preminumColumn}
        />
    </Modal>
}

class ActiveStageConfigPage extends Component {

    state = {
        loading: false,
        selectRecord: undefined,
        modalVisibleState: {
            editVisible: false,
            premiumConfigVisible: false,
            premiumShowVisible: false,
            giftRecordVisible: false
        }
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

    submit = (data) => {

    }

    submitPremiumConfig = (data) => {

    }

    startTicket = () => {

    }

    stopTicket = () => {

    }

    enableOperate = {
        start: () => this.state.selectRecord && this.state.selectRecord.status === "未开始",
        edit: () => this.state.selectRecord && !(this.state.selectRecord.status === "已结束"),
        stop: () => this.state.selectRecord && this.state.selectRecord.status === "正在进行",
        premiumConfig: () => this.state.selectRecord && !(this.state.selectRecord.status === "已结束"),
        resultEdit: () => this.state.selectRecord && this.state.selectRecord.status === "已结束",
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
                                        onClick={() => this.modalViewChange("editVisible", true)}>创建</Button>
                            </Col>
                            {this.enableOperate.edit() ?
                                <Col>
                                    <Button icon={<PlusOutlined/>} type={"primary"}
                                            style={{marginBottom: '10px'}}
                                            onClick={() => this.modalViewChange("editVisible", true)}>编辑</Button>
                                </Col> : <div/>}
                            {this.enableOperate.start() ?
                                <Col>
                                    <Button icon={<PlusOutlined/>}
                                            style={{marginBottom: '10px'}}
                                            type={"primary"}
                                            onClick={this.startTicket}>开启投票</Button>
                                </Col> : <div/>}
                            {this.enableOperate.stop() ?
                                <Col>
                                    <Button icon={<PlusOutlined/>}
                                            style={{marginBottom: '10px'}}
                                            type={"primary"}
                                            onClick={this.stopTicket}>停止投票</Button>
                                </Col> : <div/>}
                            {this.enableOperate.premiumConfig() ?
                                <Col>
                                    <Button icon={<PlusOutlined/>}
                                            style={{marginBottom: '10px'}}
                                            type={"primary"}
                                            onClick={() => this.modalViewChange("premiumConfigVisible", true)}>奖品配置</Button>
                                </Col> : <div/>}
                            {this.enableOperate.resultEdit() ?
                                <Col>
                                    <Button icon={<PlusOutlined/>}
                                            style={{marginBottom: '10px'}}
                                            type={"primary"}
                                            onClick={() => {
                                            }}>结果录入</Button>
                                </Col> : <div/>}
                        </Row>
                        {/*<Button type="primary" icon={<PlusOutlined/>}
                                style={{marginBottom: '10px', marginLeft: '10px'}}
                                onClick={() => this.modalViewChange("editVisible", true)}>创建</Button>*/}
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
                           columns={columns({viewRewardRecord: () => this.modalViewChange("giftRecordVisible", true)})}
                           dataSource={mockData}/>
                </div>
                <PremiumConfig visible={this.state.modalVisibleState.premiumConfigVisible} premiumList={preminumList}
                               data={preminumDatas}
                               submit={this.submitPremiumConfig}
                               onCancel={() => this.modalViewChange("premiumConfigVisible", false)}/>
                <PremiumView onCancel={() => this.modalViewChange("premiumShowVisible", false)} data={preminumDatas}
                             visible={this.state.modalVisibleState.premiumShowVisible}/>
                <EditForm visible={this.state.modalVisibleState.editVisible} data={[]}
                          onCancel={() => this.modalViewChange("editVisible", false)} submit={this.submit}/>
                <GiftRecord data={this.state.selectRecord && this.state.selectRecord.id}
                            visible={this.state.modalVisibleState.giftRecordVisible}
                            onCancel={() => this.modalViewChange("giftRecordVisible", false)}/>
            </React.Fragment>
        );
    }
}

export default ActiveStageConfigPage;
