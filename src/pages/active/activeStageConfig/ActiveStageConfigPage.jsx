import React, {Component, useEffect, useState} from 'react';
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Modal, Progress,
    Row,
    Select,
    Table,
    Tag,
    Tooltip
} from "antd";
import GiftRecordPage from "../giftRecord";
import {connect} from "react-redux";
import moment from 'moment';
import request from "../../../request/request";
import {getImgUrl} from "../../../utils/core";
import ActiveStageContestantPage from "./ActiveStageContestantPage";

const {RangePicker} = DatePicker;
const {TextArea} = Input
const {confirm} = Modal;

const stageResultColumns = [{
    title: '选手头像',
    dataIndex: 'picture',
    key: 'picture',
}, {
    title: '选手姓名',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '所属战队',
    dataIndex: 'teamName',
    key: 'teamName',
},]

const rewardColumn = [{
    title: '图片',
    dataIndex: 'image',
    key: 'image',
    render: value => value ? <img style={{height: '48px'}} src={getImgUrl(value)}/> : <div/>
    // <DefaultUserImgIcon style={{fontSize: '32px'}}/>
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '奖品类型',
    dataIndex: 'type',
    key: 'type',
    render: value => value === "虚拟奖品" ? <Tag color={"#F56955"}>{value}</Tag> : <Tag color={"#338c98"}>{value}</Tag>
}, {
    title: '消耗数量',
    dataIndex: 'usedCount',
    key: 'usedCount',
    render: (value, record) =>
        <Tooltip title={"已领取：" + value + "已发放：" + record.assignedCount + "库存：" + record.totalCount}>
            <Progress width={"50px"} percent={100 * record.assignedCount / record.totalCount}
                      success={{percent: 100 * value / record.totalCount}}/>
        </Tooltip>
}, {
    title: '发放数量',
    dataIndex: 'rewardCount',
    key: 'rewardCount',
    render: (value, record) => (
        <Form.Item
            style={{
                margin: 0,
            }}
            name='Count'
            rules={[
                {
                    required: true,
                    message: `请设置发放数量！`,
                },
            ]}
        >
            <InputNumber onChange={(data) => record.rewardCount = data} value={record.rewardCount}
                         defaultValue={record.rewardCount || 0} min={0} max={record.totalCount - record.assignedCount}
                         placeholder="请输入"/>
        </Form.Item>
    )
},]

const stageResultData = [{
    name: "王旺旺",
    teamName: "战队1"
}, {
    name: "王旺旺",
    teamName: "战队1"
}, {
    name: "王旺旺",
    teamName: "战队1"
}, {
    name: "王旺旺",
    teamName: "战队1"
}, {
    name: "王旺旺",
    teamName: "战队1"
}, {
    name: "王旺旺",
    teamName: "战队1"
}, {
    name: "王旺旺",
    teamName: "战队1"
}, {
    name: "王旺旺",
    teamName: "战队1"
},]

const rewardDatas = [{
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

const columns = (operateFunc) => [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
}, {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
}, {
    title: '投票权益:选票',
    dataIndex: 'ticketExchangeRate',
    key: 'ticketExchangeRate',
    render: value => value + ":1"
}, {
    title: '当前状态',
    dataIndex: 'status',
    key: 'status',
    render: value => value ? value === "正在进行" ? <Tag color="#87d068">{value}</Tag> : value === "未开始" ?
        <Tag color="#023214">{value}</Tag> : <Tag color="#f50">{value}</Tag> : <div/>
}, {
    title: '比赛结果',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => record.status === "已结束" ? <a onClick={operateFunc.viewStageResult}>点击查看</a> : <div/>
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
            data.timeRange = [moment(data.startTime, 'YYYY-MM-DDTHH:mm:ss').utcOffset(480, true), moment(data.endTime, 'YYYY-MM-DDTHH:mm:ss').utcOffset(480, true)]
            form.setFieldsValue(data)
        } else {
            form.resetFields()
        }
    },)

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
                        values.startTime = values.timeRange[0].format("YYYY-MM-DDTHH:mm:ss")
                        values.endTime = values.timeRange[1].format("YYYY-MM-DDTHH:mm:ss")
                        delete values.timeRange
                        if (data) {
                            values.rewards = data.rewards
                            values.status = data.status
                            values.id = data.id
                            submit(values, 'edit');
                        } else {
                            submit(values, 'add');
                        }
                    }).catch((info) => {
                    console.log('Validate Failed:', info);
                });
            }}
            width={"600px"}>
            <Form
                {...{
                    labelCol: {
                        span: 6,
                    },
                    wrapperCol: {
                        span: 18,
                    },
                }}
                form={form}
            >
                <Form.Item name="name" label={"活动名称"} rules={[{
                    required: true,
                    message: '请输入活动名称!',
                }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="ticketExchangeRate" label={"每一票权益"} rules={[{
                    required: true,
                    message: '请设置投票消耗权益数量!',
                }]}>
                    <InputNumber min={1}/>
                </Form.Item>
                <Form.Item name="timeRange" label={"活动时间"}>
                    <RangePicker showTime format={"YYYY-MM-DD HH:mm:ss"} allowClear placeholder={["开始时间", "结束时间"]}/>
                </Form.Item>
                <Form.Item name="remark" label={"备注"}>
                    <TextArea rows={2}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

const RewardView = ({data, visible, onCancel}) => {
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
            columns={rewardColumn}
        />
    </Modal>
}

const StageResultView = ({data, visible, onCancel}) => {
    return <Modal
        maskClosable={false}
        visible={visible}
        title={"获胜选手"}
        footer={null}
        onCancel={onCancel}
        onOk={onCancel}
        width={"1000px"}>
        <Table
            dataSource={data}
            columns={stageResultColumns}
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
        <GiftRecordPage id={data}/>
    </Modal>
}

const RewardConfig = (props) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectRowKeys, setSelectRowKeys] = useState([]);
    const [rewardList, setRewardList] = useState([])
    const [data, setData] = useState([])

    useEffect(() => {
        if (props.rewardList) {
            let rewardList = []
            let data = props.data || []
            props.rewardList.forEach(m => {
                let match = data.filter(n => n.id === m.id)
                if (match.length > 0) {
                    m.rewardCount = match[0].rewardCount
                } else {
                    m.rewardCount = 0
                }
                rewardList.push(m)
            })

            setSelectRowKeys(props.data.filter(m => m.count > 0).map(m => m.id))
            setSelectedRows(props.data.filter(m => m.count > 0))
            setRewardList(rewardList)
            setData(props.data)
        }
    }, [props.data, props.rewardList],)

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
            dataSource={rewardList}
            columns={rewardColumn}
        />
    </Modal>
}

class ActiveStageConfigPage extends Component {

    componentWillMount() {
        this.props.init()
    }

    state = {
        loading: false,
        selectRecord: undefined,
        rewardDatas: [],
        modalVisibleState: {
            editVisible: false,
            premiumConfigVisible: false,
            premiumShowVisible: false,
            giftRecordVisible: false,
            stageResultVisible: false,
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

    submit = async (data, mode) => {
        if (mode === "edit") {
            await this.props.update(data)
        } else {
            await this.props.add(data)
        }
        this.modalViewChange("editVisible", false)
        this.props.init()
    }

    toRewardConfig = async () => {
        let id = this.state.selectRecord.id
        let result = await request("get", "/api/stages/" + id + "/rewards")
        this.setState({rewardDatas: (result && result._embedded && result._embedded.stageRewardConfigs) || []})
        this.modalViewChange("configStageResultVisible", true)
    }

    toConfigResult = async () => {
        this.modalViewChange("configStageResultVisible", true)
    }

    submitRewardConfig = (data) => {
        let record = this.state.selectRecord
        record.rewards = data.map(m => ({rewardId: m.id, rewardCount: m.rewardCount}))
        this.submit(record, "edit")
    }

    startTicket = () => {
        let startFunc = this.props.start
        let recordId = this.state.selectRecord.id
        let init = this.props.init
        confirm({
            title: '警告',
            icon: <ExclamationCircleOutlined/>,
            content: '确定要提前开启活动"' + this.state.selectRecord.name + '"? 这样做将会停止正在进行的活动，是否确认？',
            onOk() {
                confirm({
                    title: '再次确认',
                    icon: <ExclamationCircleOutlined/>,
                    content: '再次确认开启？',
                    async onOk() {
                        await startFunc(recordId)
                        init()
                    },
                });
            },
        });
    }

    stopTicket = () => {
        let stopFunc = this.props.stop
        let recordId = this.state.selectRecord.id
        let init = this.props.init
        confirm({
            title: '警告',
            icon: <ExclamationCircleOutlined/>,
            content: '确定要停止活动"' + this.state.selectRecord.name + '"? 这样做将会关闭投票通道，是否确认？',
            onOk() {
                confirm({
                    title: '再次确认',
                    icon: <ExclamationCircleOutlined/>,
                    content: '再次确认停止？',
                    async onOk() {
                        await stopFunc(recordId)
                        init()
                    },
                });
            },
        });
    }

    raffle = () => {
        let raffleFunc = this.props.startRaffle
        let recordId = this.state.selectRecord.id
        let init = this.props.init
        confirm({
            title: '提醒',
            icon: <ExclamationCircleOutlined/>,
            content: '确定开始抽奖？',
            async onOk() {
                await raffleFunc(recordId)
                init()
            },
        });
    }

    configResult = async data => {
        let stageId = this.state.selectRecord.id
        await this.props.configResult({
            stageId,
            contestants: data
        })
        this.props.init()
        this.modalViewChange("configStageResultVisible", false)
    }

    enableOperate = {
        start: () => this.state.selectRecord && this.state.selectRecord.status === "未开始",
        edit: () => this.state.selectRecord && !(this.state.selectRecord.status === "已结束"),
        stop: () => this.state.selectRecord && this.state.selectRecord.status === "正在进行",
        premiumConfig: () => this.state.selectRecord && !(this.state.selectRecord.status === "已结束"),
        resultEdit: () => this.state.selectRecord && this.state.selectRecord.status !== "未开始" && this.state.selectRecord.status !== "已结束",
        startLottery: () => this.state.selectRecord && this.state.selectRecord.result && this.state.selectRecord.result.length > 0,
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
                                        onClick={() => {
                                            this.modalViewChange("editVisible", true)
                                            this.setState({selectRecord: undefined})
                                        }}>创建</Button>
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
                                            onClick={this.startTicket}>提前开启</Button>
                                </Col> : <div/>}
                            {this.enableOperate.stop() ?
                                <Col>
                                    <Button icon={<PlusOutlined/>}
                                            style={{marginBottom: '10px'}}
                                            type={"primary"}
                                            onClick={this.stopTicket}>停止活动</Button>
                                </Col> : <div/>}
                            {this.enableOperate.premiumConfig() ?
                                <Col>
                                    <Button icon={<PlusOutlined/>}
                                            style={{marginBottom: '10px'}}
                                            type={"primary"}
                                            onClick={() => this.toRewardConfig()}>奖品配置</Button>
                                </Col> : <div/>}
                            {this.enableOperate.resultEdit() ?
                                <Col>
                                    <Button icon={<PlusOutlined/>}
                                            style={{marginBottom: '10px'}}
                                            type={"primary"}
                                            onClick={() => this.toConfigResult()}>设定晋级人员</Button>
                                </Col> : <div/>}
                            {this.enableOperate.startLottery() ?
                                <Col>
                                    <Button icon={<PlusOutlined/>}
                                            style={{marginBottom: '10px'}}
                                            type={"primary"}
                                            onClick={() => {
                                            }}>开启抽奖</Button>
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
                           columns={columns({
                               viewRewardRecord: () => this.modalViewChange("giftRecordVisible", true),
                               viewStageResult: () => this.modalViewChange("stageResultVisible", true)
                           })}
                           dataSource={this.props.data}/>
                </div>
                <RewardConfig visible={this.state.modalVisibleState.premiumConfigVisible}
                              rewardList={this.props.rewardData}
                              data={this.state.rewardDatas} submit={this.submitRewardConfig}
                              onCancel={() => this.modalViewChange("premiumConfigVisible", false)}/>
                <RewardView onCancel={() => this.modalViewChange("premiumShowVisible", false)} data={rewardDatas}
                            visible={this.state.modalVisibleState.premiumShowVisible}/>
                <EditForm visible={this.state.modalVisibleState.editVisible} data={this.state.selectRecord}
                          onCancel={() => this.modalViewChange("editVisible", false)} submit={this.submit}/>
                <GiftRecord data={this.state.selectRecord && this.state.selectRecord.id}
                            visible={this.state.modalVisibleState.giftRecordVisible}
                            onCancel={() => this.modalViewChange("giftRecordVisible", false)}/>
                <StageResultView data={stageResultData}
                                 visible={this.state.modalVisibleState.stageResultVisible}
                                 onCancel={() => this.modalViewChange("stageResultVisible", false)}/>
                <ActiveStageContestantPage visible={this.state.modalVisibleState.configStageResultVisible}
                                           onCancel={() => this.modalViewChange("configStageResultVisible", false)}
                                           submit={this.configResult}
                                           configResult={this.state.selectRecord && this.state.selectRecord.result}/>
            </React.Fragment>
        );
    }
}

const mapState = (state, ownProps) => ({
    data: state.activeStageConfigModel.data,
    rewardData: state.rewardConfigModel.data,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    init: async (data) => {
        await dispatch.activeStageConfigModel.init(data)
        await dispatch.rewardConfigModel.init(data)
    },
    /*编辑*/
    update: async (data) => {
        await dispatch.activeStageConfigModel.update(data)
    },
    /*添加*/
    add: async (data) => {
        await dispatch.activeStageConfigModel.add(data)
    },
    /*开启*/
    start: async (data) => {
        await dispatch.activeStageConfigModel.start(data)
    },
    /*停止*/
    stop: async (data) => {
        await dispatch.activeStageConfigModel.stop(data)
    },
    /*开始抽奖*/
    startRaffle: async (data) => {
        await dispatch.activeStageConfigModel.startRaffle(data)
    },
    /*设定结果*/
    configResult: async (data) => {
        await dispatch.activeStageConfigModel.configResult(data)
    },
    /*奖品配置*/
    configReward: async (data) => {
        await dispatch.activeStageConfigModel.configReward(data)
    }
})
export default connect(mapState, mapDispatch)(ActiveStageConfigPage);
