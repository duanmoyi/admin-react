import React, {Component, useEffect, useState} from 'react';
import {PlusOutlined} from "@ant-design/icons";
import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Progress,
    Row,
    Select,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import {defaultFormItemLayout} from "../../../utils/formUtils";
import {connect} from "react-redux";
import {Guid} from "js-guid";
import {
    CommonImgUpload, defaultSort,
    getColumnInputSearchProps,
    getColumnSelectSearchProps,
    getImgUrl,
    tableChange
} from "../../../utils/core";
import request from "../../../request/request";

const {TextArea} = Input

const columns = (operateFunc) => [{
    title: '图片',
    dataIndex: 'image',
    key: 'image',
    render: value => value ? <img style={{height: '48px'}} src={getImgUrl(value)}/> : <div/>
    // <DefaultUserImgIcon style={{fontSize: '32px'}}/>
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ...getColumnInputSearchProps("名称")
}, {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: value => value === "虚拟奖品" ? <Tag color={"#F56955"}>{value}</Tag> : <Tag color={"#338c98"}>{value}</Tag>,
    ...getColumnSelectSearchProps("类型", [{
        key: <Tag color={"#F56955"}>虚拟奖品</Tag>,
        value: "虚拟奖品",
    }, {key: <Tag color={"#338c98"}>实物奖品</Tag>, value: "实物奖品",}]),
}, {
    title: '数量',
    dataIndex: 'usedCount',
    key: 'usedCount',
    render: (value, record) =>
        <Tooltip title={"已领取：" + value + "； 已发放：" + record.assignedCount + "；   库存：" + record.totalCount}>
            <Progress width={"50px"} percent={100 * record.assignedCount / record.totalCount}
                      success={{percent: 100 * value / record.totalCount}}/>
        </Tooltip>
}, {
    title: '操作',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => (record.type === "虚拟奖品" ?
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
    const [category, setCategory] = useState()
    const [imgFile, setImgFile] = useState([])

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data)
            setCategory(data.type)
            if (data.image) {
                setImgFile([{
                    uid: Guid.newGuid().toString(),
                    name: data.image,
                    status: 'done',
                    thumbUrl: getImgUrl(data.image),
                    url: getImgUrl(data.image),
                }])
            }
        }
        return () => {
            form.resetFields()
            setImgFile([])
        }
    }, [data, form])

    const changeCategory = value => {
        setCategory(value)
    }

    const cancel = () => {
        onCancel()
    }

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
            title={data ? "修改奖品信息" : "添加奖品信息"}
            okText="提交"
            cancelText="取消"
            onCancel={cancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        if (imgFile.length > 0) {
                            let file = imgFile[0]
                            if (file.response) {
                                values.image = file.response.data.name
                            } else {
                                values.image = file.name
                            }
                        } else {
                            values.image = undefined
                        }
                        if (data) {
                            values.id = data.id
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
                <Form.Item name="type" label={"奖品类型"} rules={[{
                    required: true,
                    message: '请选择奖品类型!',
                }]}>
                    <Select onChange={changeCategory}>
                        <Select.Option value="虚拟奖品">虚拟奖品</Select.Option>
                        <Select.Option value="实物奖品">实物奖品</Select.Option>
                    </Select>
                </Form.Item>
                {category === "实物奖品" ? <Form.Item name="totalCount" label={"库存数量"} rules={[{
                    required: true,
                    message: '请设置库存数量!',
                }]}>
                    <InputNumber min={0}/>
                </Form.Item> : <div/>}
                <Form.Item name="image" label={"奖品图片"}>
                    <CommonImgUpload uploadFunc={imgUploadFunc} imgFile={imgFile}/>
                </Form.Item>
                <Form.Item name="details" label={"奖品描述"}>
                    <TextArea rows={2}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

class GiftConfigPage extends Component {

    state = {
        loading: false,
        selectRecord: undefined,
        modalVisibleState: {editVisible: false, giftListShowVisible: false},
        searchData: {filter: [], sort: [defaultSort], page: this.props.page}
    }

    componentWillMount() {
        this.props.fetch(this.state.searchData)
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

    filterConvert = filters => {
        let result = []
        for (let key in filters) {
            if (!filters[key]) {
                continue
            }

            let operate = "eq"
            // switch (key) {
            //     case "startTime":
            //         operate = "gt"
            //         break
            //     case "endTime":
            //         operate = "lt"
            //         break
            // }
            result.push({field: key, value: filters[key], type: operate})
        }
        return result
    }

    submit = async (data, mode) => {
        this.modalViewChange("editVisible", false)
        if (mode === "edit") {
            await this.props.update(data)
        } else {
            await this.props.add(data)
        }
        this.props.init()
    }

    importDetail = () => {
        let id = this.state.selectRecord.id
        for (let i = 0; i < 100; i++) {
            const data = {
                "rewardId": id,
                "tokens": [
                    Guid.newGuid().toString()
                ],
                "expire": "2021-08-14T09:51:05.174Z",
            }
            request("post", "api/reward_ticket", data)
        }
    }

    enableOperate = {
        edit: () => this.state.selectRecord,
        importDetail: () => this.state.selectRecord && this.state.selectRecord.type === "虚拟奖品",
    }

    render() {
        return (
            <React.Fragment>
                <div className="site-layout-background"
                     style={{
                         height: '90vh'
                     }}>
                    <div style={{marginBottom: '10px', marginLeft: '10px'}}>
                        <Row gutter={10}>
                            <Col>
                                <Button type="primary" icon={<PlusOutlined/>}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        onClick={() => {
                                            this.modalViewChange("editVisible", true)
                                            this.setState({selectRecord: undefined})
                                        }}>添加</Button>
                            </Col>
                            {this.enableOperate.edit() ? <Col>
                                <Button icon={<PlusOutlined/>}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        type="primary"
                                        onClick={() => this.modalViewChange("editVisible", true)}>编辑</Button>
                            </Col> : <div/>}
                            {this.enableOperate.importDetail() ? <Col>
                                <Button icon={<PlusOutlined/>}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        type="primary"
                                        onClick={this.importDetail}>导入奖品</Button>
                            </Col> : <div/>}
                        </Row>
                    </div>
                    <Spin tip={"正在加载。。。"} spinning={this.props.initing > 0 || this.props.loading > 0}>
                        <Table style={{margin: '20px 20px'}} loading={this.state.loading}
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
                                       showGiftList: () => this.modalViewChange("giftListShowVisible", true),
                                       addFilter: () => {
                                       },
                                       clearFilter: () => {
                                       },
                                   }
                               )}
                               onChange={(pagination, filters, sorts, extra) => tableChange(pagination, this.filterConvert(filters), sorts, extra, this)}
                               pagination={{...this.props.page}}
                               dataSource={this.props.data}/>
                    </Spin>
                </div>
                <GiftList onCancel={() => this.modalViewChange("giftListShowVisible", false)} data={giftListData}
                          visible={this.state.modalVisibleState.giftListShowVisible}/>
                <EditForm visible={this.state.modalVisibleState.editVisible} data={this.state.selectRecord}
                          onCancel={() => this.modalViewChange("editVisible", false)} submit={this.submit}/>
            </React.Fragment>
        );
    }
}


const mapState = (state, ownProps) => ({
    ...state.rewardConfigModel,
    initing: state.loading.effects.rewardConfigModel.init,
    loading: state.loading.models.rewardConfigModel,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    fetch: async (data) => {
        await dispatch.rewardConfigModel.init(data)
    },
    /*编辑*/
    update: async (data) => {
        await dispatch.rewardConfigModel.update(data)
    },
    /*添加*/
    add: async (data) => {
        await dispatch.rewardConfigModel.add(data)
    },
    delete: async (data) => {
        await dispatch.rewardConfigModel.delete(data)
    },
})
export default connect(mapState, mapDispatch)(GiftConfigPage);
