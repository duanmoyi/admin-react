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
    Select, Spin,
    Table,
    Tag,
    Tooltip,
    Image
} from "antd";
import GiftRecordPage from "../giftRecord";
import {connect} from "react-redux";
import moment from 'moment';
import request from "../../../request/request";
import {
    CommonImgUpload,
    defaultSort,
    getColumnDateTimeSearchProps,
    getColumnInputSearchProps,
    getColumnSelectSearchProps,
    getImgUrl, imgUploadFunc, renderTime, setImg, tableChange
} from "../../../utils/core";
import ActiveStageContestantPage from "./ActiveStageContestantPage";
import {Guid} from "js-guid";

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

const rewardColumn = (data) => [{
    title: '图片',
    dataIndex: 'image',
    key: 'image',
    render: value => value ? <Image width="48px" src={getImgUrl(value)}/> : <div/>
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: value => value === "虚拟奖品" ? <Tag color={"#F56955"}>{value}</Tag> : <Tag color={"#338c98"}>{value}</Tag>
}, {
    title: '数量',
    dataIndex: 'usedCount',
    key: 'usedCount',
    render: (value, record) =>
        <Tooltip title={"已领取：" + value + "； 已发放：" + record.assignedCount + "； 库存：" + record.totalCount}>
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
            <InputNumber onChange={(data) => record.rewardCount = data}
                         value={record.rewardCount || 0} defaultValue={record.rewardCount || 0}
                         min={0} max={record.totalCount - record.assignedCount} placeholder="请输入"/>
        </Form.Item>
    )
},]

const columns = (operateFunc) => [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    ...getColumnInputSearchProps("名称")
}, {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    sorter: true,
    render: renderTime,
    ...getColumnDateTimeSearchProps('开始时间')
}, {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    sorter: true,
    render: renderTime,
    ...getColumnDateTimeSearchProps('结束时间')
}, {
    title: '每票里程数',
    dataIndex: 'ticketExchangeRate',
    key: 'ticketExchangeRate',
    sorter: true,
}, {
    title: '当前状态',
    dataIndex: 'status',
    key: 'status',
    ...getColumnSelectSearchProps("状态", [{
        key: "正在进行",
        value: "正在进行",
    }, {key: "未开始", value: "未开始",}, {key: "已结束", value: "已结束",}]),
    sorter: true,
    render: value => value ? value === "正在进行" ? <Tag color="#87d068">{value}</Tag> : value === "未开始" ?
        <Tag color="#023214">{value}</Tag> : <Tag color="#f50">{value}</Tag> : <div/>
}, {
    title: '晋级选手',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => record.status === "已结束" ?
        <a onClick={() => operateFunc.viewStageResult(value, record)}>点击查看</a> : <div/>
}, {
    title: '获奖记录',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => <a onClick={() => operateFunc.viewRewardRecord(value, record)}>点击查看</a>
}]

const EditForm = ({data, visible, submit, onCancel}) => {
    const [form] = Form.useForm()
    const [homeTitleImg, setHomeTitleImg] = useState([])
    const [orderTitleImg, setOrderTitleImg] = useState([])

    useEffect(() => {
        if (data) {
            data.timeRange = [moment(data.startTime, 'YYYY-MM-DDTHH:mm:ss').utcOffset(480, true), moment(data.endTime, 'YYYY-MM-DDTHH:mm:ss').utcOffset(480, true)]
            setImg(data.backgroundImg, setHomeTitleImg)
            setImg(data.backgroundImg, setOrderTitleImg)
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
                            if (!values.ticketExchangeRate) {
                                values.ticketExchangeRate = data.ticketExchangeRate
                            }
                            values.status = data.status
                            values.id = data.id
                            return submit(values, 'edit');
                        } else {
                            return submit(values, 'add');
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
                {(!data || data.status === "未开始") ?
                    <Form.Item name="ticketExchangeRate" label={"每票里程数"} rules={[{
                        required: true,
                        message: '请设置每票里程数!',
                    }]}>
                        <InputNumber min={1}/>
                    </Form.Item> : <div/>}
                <Form.Item name="timeRange" label={"活动时间"} rules={[{
                    required: true,
                    message: '请输入活动时间!',
                }]}>
                    <RangePicker showTime format={"YYYY-MM-DD HH:mm:ss"} allowClear placeholder={["开始时间", "结束时间"]}/>
                </Form.Item>
                <Form.Item name="entranceImage" label={"首页标题图片"}>
                    <CommonImgUpload uploadFunc={imgUploadFunc(setHomeTitleImg)} imgFile={homeTitleImg}/>
                </Form.Item>
                <Form.Item name="rankImage" label={"人气榜标题图片"}>
                    <CommonImgUpload uploadFunc={imgUploadFunc(setOrderTitleImg)} imgFile={orderTitleImg}/>
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
        destroyOnClose
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
        destroyOnClose
        maskClosable={false}
        visible={visible}
        title={"获奖信息"}
        footer={null}
        onCancel={onCancel}
        width={"1500px"}>
        <div style={{marginTop: '-50px'}}>
            <GiftRecordPage stageId={data} height={"73vh"}/>
        </div>
    </Modal>
}

const RewardConfig = (props) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectRowKeys, setSelectRowKeys] = useState([]);
    const [rewardList, setRewardList] = useState([])

    useEffect(() => {
        if (props.rewardList) {
            let data = props.data.data || []
            let selectData = props.rewardList.filter(m => data.filter(n => n.rewardId === m.id && n.rewardCount > 0).length > 0)
            selectData.forEach(m => {
                let match = data.filter(n => n.rewardId === m.id)
                m.rewardCount = match[0].rewardCount
            })
            props.rewardList.forEach(m => {
                let match = data.filter(n => n.rewardId === m.id)
                if (match.length > 0) {
                    m.rewardCount = match[0].rewardCount
                } else {
                    m.rewardCount = 0
                }
            })
            setSelectRowKeys(selectData.map(m => m.id))
            setSelectedRows(selectData)
        }
        return () => {
            setSelectRowKeys([])
            setSelectedRows([])
        }
    }, [props.data.data],)

    const submit = () => {
        if (!selectedRows || selectedRows.length < 1) {
            message.warn("请选择下发奖品！")
        } else {
            let result = []
            props.rewardList.forEach(m => {
                let rewardId = m.id
                let selectMatch = selectedRows.filter(n => n.id === rewardId)
                let recordMatch = props.data.data.filter(n => n.rewardId === rewardId)

                if (selectMatch.length < 1 && recordMatch.length < 1) {
                    return
                }

                if (selectMatch.length > 0 && recordMatch.length > 0) {
                    recordMatch[0].rewardCount = selectMatch[0].rewardCount
                    result.push(recordMatch[0])
                    return
                }

                if (selectMatch.length > 0) {
                    result.push({rewardId: selectMatch[0].id, rewardCount: selectMatch[0].rewardCount})
                    return
                }
                if (recordMatch.length > 0) {
                    recordMatch[0].rewardCount = 0
                    result.push(recordMatch[0])
                }
            })
            props.submit(result)
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
        destroyOnClose
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
            dataSource={props.rewardList}
            columns={rewardColumn(props.data.data)}
        />
    </Modal>
}

class ActiveStageConfigPage extends Component {

    defaultSearchData = {filter: [], sort: [defaultSort], page: this.props.page}

    state = {
        rewardDatas: {sequence: Guid.newGuid(), data: []},
        modalVisibleState: {
            editVisible: false,
            premiumConfigVisible: false,
            premiumShowVisible: false,
            giftRecordVisible: false,
            stageResultVisible: false,
        },
        searchData: this.defaultSearchData
    }

    init = () => {
        this.setState({searchData: this.defaultSearchData, selectRecord: undefined})
        this.props.fetch(this.defaultSearchData)
    }

    fetch = (mode) => {
        this.setState({selectRecord: undefined})
        this.props.fetch(this.state.searchData, mode)
    }

    componentWillMount() {
        this.fetch("init")
    }

    filterConvert = filters => {
        let result = []
        for (let key in filters) {
            if (!filters[key] || filters[key].length < 1) {
                continue
            }

            let operate = "eq"
            switch (key) {
                case "startTime":
                    operate = "lt"
                    break
                case "endTime":
                    operate = "gt"
                    break
            }
            result.push({field: key, value: filters[key][0], type: operate})
        }
        return result
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
        this.modalViewChange("editVisible", false)
        if (mode === "edit") {
            await this.props.update(data)
        } else {
            await this.props.add(data)
        }
        this.init()
    }

    toRewardConfig = async () => {
        let id = this.state.selectRecord.id
        let result = await request("get", "api2/stages/" + id + "/rewards")
        this.setState({
            rewardDatas: {
                data: (result && result._embedded && result._embedded.stageRewardConfigs) || [],
                sequence: Guid.newGuid()
            }
        })
        this.modalViewChange("premiumConfigVisible", true)
    }

    toConfigResult = async () => {
        this.modalViewChange("configStageResultVisible", true)
    }

    submitRewardConfig = (data) => {
        let record = this.state.selectRecord
        data.forEach(m => m.stateId = record.id)
        record.rewards = data
        this.submit(record, "edit")
    }

    startTicket = () => {
        let startFunc = this.props.start
        let recordId = this.state.selectRecord.id
        let init = this.init
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
                        return init()
                    },
                });
            },
        });
    }

    stopTicket = () => {
        let stopFunc = this.props.stop
        let recordId = this.state.selectRecord.id
        let init = this.init
        confirm({
            title: '警告',
            icon: <ExclamationCircleOutlined/>,
            content: '确定要结束活动"' + this.state.selectRecord.name + '"? 这样做将会关闭投票通道，是否确认？',
            onOk() {
                confirm({
                    title: '再次确认',
                    icon: <ExclamationCircleOutlined/>,
                    content: '再次确认结束？',
                    async onOk() {
                        await stopFunc(recordId)
                        return init()
                    },
                });
            },
        });
    }

    raffle = () => {
        let raffleFunc = this.props.startRaffle
        let record = this.state.selectRecord
        let init = this.init
        confirm({
            title: '提醒',
            icon: <ExclamationCircleOutlined/>,
            content: '确定开始抽奖？',
            async onOk() {
                await raffleFunc({stageId: record.id, contestants: record.preAdvancedContestants})
                init()
            },
        });
    }

    configResult = async data => {
        this.modalViewChange("configStageResultVisible", false)
        await this.props.configResult({
            ...this.state.selectRecord,
            preAdvancedContestants: data
        })
        this.init()
    }

    getActiveResult = () => {
        if (!this.state.selectRecord || !this.state.selectRecord.preAdvancedContestants || this.state.selectRecord.preAdvancedContestants.length < 1) {
            return []
        }
        return this.props.contestants.filter(m => this.state.selectRecord.preAdvancedContestants.filter(n => n === m.id).length > 0)
    }

    enableOperate = {
        start: () => this.state.selectRecord && this.state.selectRecord.status === "未开始",
        edit: () => this.state.selectRecord && !(this.state.selectRecord.status === "已结束"),
        stop: () => this.state.selectRecord && this.state.selectRecord.status === "正在进行",
        premiumConfig: () => this.state.selectRecord && !(this.state.selectRecord.status === "已结束"),
        resultEdit: () => this.state.selectRecord && this.state.selectRecord.status !== "未开始",
        startLottery: () => this.state.selectRecord && this.state.selectRecord.preAdvancedContestants && this.state.selectRecord.preAdvancedContestants.length > 0,
    }

    render() {
        return (
            <React.Fragment>
                <div className="site-layout-background">
                    <div style={{marginBottom: '10px', marginLeft: '10px'}}>
                        <Row>
                            <Col>
                                <Button type="primary" icon={<PlusOutlined/>}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        onClick={() => {
                                            this.modalViewChange("editVisible", true)
                                            this.setState({selectRecord: undefined})
                                        }}>创建</Button>
                            </Col>
                            <Col>
                                <Button icon={<PlusOutlined/>} type={"primary"} disabled={!this.enableOperate.edit()}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        onClick={() => this.modalViewChange("editVisible", true)}>编辑</Button>
                            </Col>
                            <Col>
                                <Button icon={<PlusOutlined/>} disabled={!this.enableOperate.start()}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        type={"primary"}
                                        onClick={this.startTicket}>提前开启</Button>
                            </Col>
                            <Col>
                                <Button icon={<PlusOutlined/>} disabled={!this.enableOperate.stop()}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        type={"primary"}
                                        onClick={this.stopTicket}>结束活动</Button>
                            </Col>
                            <Col>
                                <Button icon={<PlusOutlined/>} disabled={!this.enableOperate.premiumConfig()}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        type={"primary"}
                                        onClick={() => this.toRewardConfig()}>奖品配置</Button>
                            </Col>
                            <Col>
                                <Button icon={<PlusOutlined/>} disabled={!this.enableOperate.resultEdit()}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        type={"primary"}
                                        onClick={() => this.toConfigResult()}>设定晋级人员</Button>
                            </Col>
                            <Col>
                                <Button icon={<PlusOutlined/>} disabled={!this.enableOperate.startLottery()}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        type={"primary"}
                                        onClick={() => this.raffle()}>开启抽奖</Button>
                            </Col>
                        </Row>
                        {/*<Button type="primary" icon={<PlusOutlined/>}
                                style={{marginBottom: '10px', marginLeft: '10px'}}
                                onClick={() => this.modalViewChange("editVisible", true)}>创建</Button>*/}
                    </div>
                    <Spin tip={"正在加载。。。"} spinning={this.props.initing > 0 || this.props.loading > 0}>
                        <Table style={{margin: '20px 20px'}} loading={this.state.loading}
                               onChange={(pagination, filters, sorts, extra) => tableChange(pagination, this.filterConvert(filters), sorts, extra, this)}
                               rowKey={"id"}
                               rowSelection={{
                                   type: "radio",
                                   onChange: this.onChange,
                                   selectedRowKeys: (this.state.selectRecord && this.state.selectRecord.id) ? [this.state.selectRecord.id] : []
                               }}
                               onRow={
                                   record => ({
                                       onClick: event => {
                                           if (this.state.selectRecord && this.state.selectRecord.id === record.id) {
                                               this.setState({selectRecord: undefined})
                                           } else
                                               this.setState({selectRecord: record})
                                       },
                                   })
                               }
                               columns={columns({
                                   viewRewardRecord: (value, record) => {
                                       this.setState({selectRecord: record})
                                       this.modalViewChange("giftRecordVisible", true)
                                   },
                                   viewStageResult: (value, record) => {
                                       this.setState({selectRecord: record})
                                       this.modalViewChange("stageResultVisible", true)
                                   },
                               })}
                               dataSource={this.props.data}
                               pagination={{...this.props.page}}
                        />
                    </Spin>
                </div>
                <RewardConfig visible={this.state.modalVisibleState.premiumConfigVisible}
                              rewardList={this.props.rewardData}
                              data={this.state.rewardDatas} submit={this.submitRewardConfig}
                              onCancel={() => this.modalViewChange("premiumConfigVisible", false)}/>
                <RewardView onCancel={() => this.modalViewChange("premiumShowVisible", false)}
                            data={this.state.rewardDatas}
                            visible={this.state.modalVisibleState.premiumShowVisible}/>
                <EditForm visible={this.state.modalVisibleState.editVisible} data={this.state.selectRecord}
                          onCancel={() => this.modalViewChange("editVisible", false)} submit={this.submit}/>
                <GiftRecord data={this.state.selectRecord && this.state.selectRecord.id}
                            visible={this.state.modalVisibleState.giftRecordVisible}
                            onCancel={() => this.modalViewChange("giftRecordVisible", false)}/>
                <StageResultView data={this.getActiveResult()}
                                 visible={this.state.modalVisibleState.stageResultVisible}
                                 onCancel={() => this.modalViewChange("stageResultVisible", false)}/>
                <ActiveStageContestantPage visible={this.state.modalVisibleState.configStageResultVisible}
                                           onCancel={() => this.modalViewChange("configStageResultVisible", false)}
                                           submit={this.configResult}
                                           configResult={(this.state.selectRecord && this.state.selectRecord.preAdvancedContestants || []).filter(m => m.length > 0)}/>
            </React.Fragment>
        );
    }
}

const mapState = (state, ownProps) => ({
    ...state.activeStageConfigModel,
    rewardData: state.rewardConfigModel.data,
    initing: state.loading.effects.activeStageConfigModel.init,
    loading: state.loading.models.activeStageConfigModel,
    contestants: state.contestantConfigModel.data,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    fetch: async (data, mode) => {
        await dispatch.activeStageConfigModel.init(data)
        await dispatch.rewardConfigModel.init({page: {current: 1, size: 99999}})
        await dispatch.contestantConfigModel.init({filter: [], sort: [defaultSort], page: {current: 1, pageSize: 999}})
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
})
export default connect(mapState, mapDispatch)(ActiveStageConfigPage);
