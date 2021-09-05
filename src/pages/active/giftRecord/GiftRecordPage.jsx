import React, {Component, useEffect} from 'react';
import {Button, Col, Form, Input, Modal, Row, Select, Spin, Table, Tag, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {defaultFormItemLayout} from "../../../utils/formUtils";
import ImgCrop from "antd-img-crop";
import {
    defaultSort,
    getColumnDateTimeSearchProps,
    getColumnInputSearchProps,
    getColumnSelectSearchProps,
    getColumnTimeRangeSearchProps, tableChange
} from "../../../utils/core";
import {connect} from "react-redux";

const getExpressStatus = record => {
    let giftCategory = record.giftCategory
    let receiveStatus = record.receiveStatus
    let expressStatus = record.expressStatus

    if (giftCategory === "虚拟奖品") {
        return receiveStatus === "已领取" ? <Tag color={"#9ddb8c"}>已发货</Tag> : <div/>
    }

    return receiveStatus === "已领取" ? expressStatus === "已发货" ? <Tag color={"#9ddb8c"}>已发货</Tag> :
        <Tag color={"#515d1b"}>待发货</Tag> : <div/>
}

const columns = (operateFunc) => [{
    title: '用户',
    dataIndex: 'userNickName',
    key: 'userNickName',
    sorter: true,
    ...getColumnInputSearchProps("用户")
}, {
    title: '手机号',
    dataIndex: 'userPhoneNumber',
    key: 'userPhoneNumber',
    sorter: true,
    ...getColumnInputSearchProps("手机号")
}, {
    title: '名称',
    dataIndex: 'rewardName',
    key: 'rewardName',
    sorter: true,
    ...getColumnInputSearchProps("名称")
}, {
    title: '类型',
    dataIndex: 'rewardType',
    key: 'rewardType',
    sorter: true,
    ...getColumnSelectSearchProps("类型", [{
        key: "实物奖品",
        value: "实物奖品",
    }, {key: "虚拟奖品", value: "虚拟奖品",}, {key: "支付宝奖品", value: "支付宝奖品",}]),
}, {
    title: '活动',
    dataIndex: 'stageName',
    key: 'stageName',
    sorter: true,
    ...getColumnInputSearchProps("活动")
}, {
    title: '领取状态',
    dataIndex: 'receiveStatus',
    key: 'receiveStatus',
    render: (value, record) => value === "已领取" ? <Tag color={"#0a5d1c"}>{value}</Tag> :
        <Tag color={"#e596a8"}>{value}</Tag>,
    sorter: true,
    ...getColumnSelectSearchProps("领取状态", [{
        key: <Tag color={"#e596a8"}>未领取</Tag>,
        value: "未领取",
    }, {key: <Tag color={"#0a5d1c"}>已领取</Tag>, value: "已领取",}]),
}, {
    title: '领取时间',
    dataIndex: 'receiveTime',
    key: 'receiveTime',
    sorter: true,
    ...getColumnTimeRangeSearchProps('领取时间')
}, {
    title: '发货状态',
    dataIndex: 'expressStatus',
    key: 'expressStatus',
    render: (value, record) => getExpressStatus(record),
    sorter: true,
    ...getColumnSelectSearchProps("发货状态", [{
        key: <Tag color={"#515d1b"}>待发货</Tag>,
        value: "待发货",
    }, {key: <Tag color={"#9ddb8c"}>已发货</Tag>, value: "已发货",}]),
}, {
    title: '发货时间',
    dataIndex: 'expressTime',
    key: 'expressTime',
    sorter: true,
    ...getColumnTimeRangeSearchProps('发货时间')
}, {
    title: '物流单号',
    dataIndex: 'expressCode',
    key: 'expressCode',
    ...getColumnInputSearchProps("物流单号")
}, {
    title: '操作',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => record.giftCategory === "实物奖品" && record.expressStatus === "未发货" ?
        <a onClick={() => operateFunc.expressFunc(record)}>去发货</a> : <div/>

}]

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
        modalVisibleState: {expressVisible: false},
        searchData: {filter: [], sort: [defaultSort], page: this.props.page}
    }

    modalViewChange = (modalStateKey, view) => {
        const {...modalVisibleState} = this.state.modalVisibleState
        modalVisibleState[modalStateKey] = view
        this.setState({
            modalVisibleState: modalVisibleState
        })
    }

    init() {
        let {filter, ...other} = this.state.searchData
        filter.push({
            field: "stageId", value: this.props.stageId, type: "eq"
        })
        if (this.props.stageId) {
            this.props.fetch({filter, ...other})
        }else{
            this.props.fetch(this.state.searchData)
        }
    }

    componentWillMount() {
        this.init()
    }

    express = (data) => {

    }

    filterConvert = filters => {
        let result = []
        for (let key in filters) {
            if (!filters[key]) {
                continue
            }

            let operate = "eq"
            switch (key) {
                case "receiveTime":
                case "expressTime":
                    operate = "timeRange"
            }
            result.push({field: key, value: filters[key], type: operate})
        }
        if (this.props.stageId) {
            result.push({field: "stageId", value: this.props.stageId, type: "eq"})
        }
        return result
    }

    render() {
        return (
            <React.Fragment>
                <div className="site-layout-background">
                    <Spin tip={"正在加载。。。"} spinning={this.props.initing > 0 || this.props.loading > 0}>
                        <Table style={{padding: '50px 30px'}} bordered loading={this.state.loading}
                               size={"middle"}
                               columns={columns({
                                   expressFunc: () => this.modalViewChange("expressVisible", true),
                               })}
                               dataSource={this.props.data}
                               onChange={(pagination, filters, sorts, extra) => tableChange(pagination, this.filterConvert(filters), sorts, extra, this)}
                               pagination={{...this.props.page}}/>
                    </Spin>
                </div>
                <ExpressForm visible={this.state.modalVisibleState.expressVisible} data={[]}
                             onCancel={() => this.modalViewChange("expressVisible", false)} submit={this.express}/>
            </React.Fragment>
        );
    }
}

const mapState = (state, ownProps) => ({
    ...state.rewardRecordConfig,
    initing: state.loading.effects.rewardRecordConfig.init,
    loading: state.loading.models.rewardRecordConfig,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    fetch: async (data) => {
        await dispatch.rewardRecordConfig.init(data)
    },
})
export default connect(mapState, mapDispatch)(GiftRecordPage);
