import React, {Component, useEffect, useState} from 'react';
import {Button, Cascader, Col, Form, Input, message, Modal, Radio, Row, Select, Spin, Table, Tag, Image} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {defaultFormItemLayout} from "../../../utils/formUtils";
import {connect} from "react-redux";
import {Guid} from "js-guid";
import {
    CommonImgUpload,
    defaultSort,
    getColumnInputSearchProps,
    getColumnSelectSearchProps,
    getImgUrl,
    tableChange
} from "../../../utils/core";
import {getCityData} from "../../../request/request";

const {TextArea} = Input

const columns = (operateFunc, teamData) => [{
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    render: value => value ? <Image width="48px" src={getImgUrl(value)}/> : <div/>,
}, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    ...getColumnInputSearchProps("姓名")
}, {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    ...getColumnSelectSearchProps("性别", [{
        key: "男",
        value: "男"
    }, {key: "女", value: "女"}])
}, {
    title: '战队',
    dataIndex: 'teamName',
    key: 'teamName',
    sorter: true,
    ...getColumnSelectSearchProps("战队", teamData.map(m => ({
        key: m.teamName + "（" + m.name + "）",
        value: m.teamId
    })))
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
        <Tag color={"#45e047"}>{value}</Tag>,
    ...getColumnSelectSearchProps("性别", [{
        key: <Tag color={"#e3e0e2"}>已淘汰</Tag>,
        value: "已淘汰"
    }, {
        key: <Tag color={"#45e047"}>参赛中</Tag>,
        value: "参赛中"
    }])
}, {
    title: '操作',
    dataIndex: 'id',
    key: 'id',
    render: (value, record) => <Row gutter={10}>
        <Col><a onClick={() => operateFunc.editFunc(record)}>编辑</a></Col>
        <Col>{record.teamName ? <a onClick={() => operateFunc.editTeam(record)}>更换战队</a> :
            <a onClick={() => operateFunc.editTeam(record)}>加入战队</a>}</Col>
    </Row>
}]

const EditTutorForm = ({visible, data, onCancel, submit, teamData}) => {
    const [form] = Form.useForm()

    useEffect(() => {
        if (data && data.id) {
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
                        data.teamId = values.teamId
                        delete data.teamName
                        submit(data, 'edit')
                    }).catch((info) => {
                    console.log('Validate Failed:', info);
                });
            }}>
            <Form
                {...defaultFormItemLayout}
                form={form}
            >
                <Form.Item name="teamId" label={"选择战队"} rules={[{
                    required: true,
                    message: '选择战队!',
                }]}>
                    <Select>
                        {teamData.map(m => <Select.Option value={m.teamId}>{m.teamName}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}

const EditForm = ({visible, data, onCancel, submit, teamData, cityData}) => {
    const [form] = Form.useForm()
    const [imgFile, setImgFile] = useState([])

    useEffect(() => {
        console.log("data::::::::::::{}", data)
        if (data && data.id) {
            console.log("11111111111111111")
            let value = Object.assign({}, data)
            value.region = data.region ? data.region.split("-") : []
            value.representRegion = data.representRegion ? data.representRegion.split("-") : []
            form.setFieldsValue(value)
            if (data.avatar) {
                setImgFile([{
                    uid: Guid.newGuid().toString(),
                    name: data.avatar,
                    status: 'done',
                    thumbUrl: getImgUrl(data.avatar),
                    url: getImgUrl(data.avatar),
                }])
            }
        }
        return () => {
            form.resetFields()
            setImgFile([])
        }
    }, [data, form])

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

    const filter = (inputValue, path) => path.some(option => option.key.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)

    return (
        <Modal
            destroyOnClose
            maskClosable={false}
            visible={visible}
            title={data ? "修改选手信息" : "添加选手信息"}
            okText="提交"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        if (values.region) {
                            values.region = values.region.join("-")
                        }
                        if (values.representRegion) {
                            values.representRegion = values.representRegion.join("-")
                        }
                        if (imgFile.length > 0) {
                            let file = imgFile[0]
                            if (file.response) {
                                values.avatar = file.response.data.name
                            } else {
                                values.avatar = file.name
                            }
                        } else {
                            values.image = undefined
                        }
                        if (!values.gender) {
                            values.gender = "男"
                        }
                        if (data && data.id) {
                            values.status = data.status
                            values.id = data.id
                            submit(values, 'edit')
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
                <Form.Item name="gender" label={"性别"}>
                    <Radio.Group defaultValue={"男"}>
                        <Radio value={"男"}>男</Radio>
                        <Radio value={"女"}>女</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="teamId" label={"所属战队"} rules={[{
                    required: true,
                    message: '选择战队!',
                }]}>
                    <Select>
                        {teamData.map(m => <Select.Option value={m.teamId}>{m.teamName}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item name="region" label={"籍贯"} rules={[{
                    required: true,
                    message: '请选择来自区域!',
                }]}>
                    <Cascader
                        options={cityData}
                        fieldNames={{
                            label: "value", value: "value", children: "children"
                        }}
                        placeholder="请选择"
                        showSearch={{filter}}
                    />
                </Form.Item>
                <Form.Item name="representRegion" label={"代表城市"} rules={[{
                    required: true,
                    message: '请选择代表区域!',
                }]}>
                    <Cascader
                        options={cityData}
                        fieldNames={{
                            label: "value", value: "value", children: "children"
                        }}
                        placeholder="请选择"
                        showSearch={{filter}}
                    />
                </Form.Item>
                <Form.Item name="avatar" label={"选手头像"}>
                    <CommonImgUpload uploadFunc={imgUploadFunc} imgFile={imgFile}/>
                </Form.Item>
                <Form.Item name="specialty" label={"特长描述"}>
                    <TextArea rows={2}/>
                </Form.Item>
                <Form.Item name="remark" label={"其他描述"}>
                    <TextArea rows={2}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

class ContestantConfigPage extends Component {

    constructor(props, context) {
        super(props, context);
        getCityData().then(data => this.cityData = data)
    }

    state = {
        loading: false,
        selectRecord: {},
        modalVisibleState: {editVisible: false},
        searchData: {filter: [], sort: [defaultSort], page: this.props.page}
    }

    componentWillMount() {
        this.props.fetch(this.state.searchData, "init")
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
        this.setState({selectRecord: {}})
        this.modalViewChange("editVisible", false)
        this.modalViewChange("editTutorVisible", false)
        this.props.fetch(this.state.searchData)
    }

    filterConvert = filters => {
        let result = []
        for (let key in filters) {
            if (!filters[key]) {
                continue
            }

            let operate = "eq"
            result.push({field: key, value: filters[key], type: operate})
        }
        return result
    }

    render() {
        return (
            <React.Fragment>
                <div className="site-layout-background">
                    <div style={{marginBottom: '10px', marginLeft: '10px'}}>
                        <Button type="primary" icon={<PlusOutlined/>}
                                style={{marginLeft: '10px', marginTop: '20px'}}
                                onClick={() => {
                                    this.modalViewChange("editVisible", true)
                                    this.setState({selectRecord: {}})
                                }}>添加</Button>
                    </div>
                    <Spin tip={"正在加载。。。"} spinning={this.props.initing > 0 || this.props.loading > 0}>
                        <Table style={{margin: '20px 20px'}} loading={this.state.loading} rowKey={"id"} size={"small"}
                               onChange={(pagination, filters, sorts, extra) => tableChange(pagination, this.filterConvert(filters), sorts, extra, this)}
                               onRow={
                                   record => ({
                                       onClick: event => {
                                           this.setState({selectRecord: record})
                                       },
                                   })
                               }
                               columns={columns({
                                   editFunc: () => this.modalViewChange("editVisible", true),
                                   editTeam: () => this.modalViewChange("editTutorVisible", true),
                               }, this.props.teamData || [])}
                               dataSource={this.props.data}
                               pagination={{...this.props.page}}/>
                    </Spin>
                </div>
                <EditForm visible={this.state.modalVisibleState.editVisible} data={this.state.selectRecord}
                          teamData={this.props.teamData} cityData={this.cityData}
                          onCancel={() => this.modalViewChange("editVisible", false)} submit={this.submit}/>
                <EditTutorForm visible={this.state.modalVisibleState.editTutorVisible} data={this.state.selectRecord}
                               teamData={this.props.teamData}
                               onCancel={() => this.modalViewChange("editTutorVisible", false)}
                               submit={this.submit}/>
            </React.Fragment>
        );
    }
}

const mapState = (state, ownProps) => ({
    ...state.contestantConfigModel,
    teamData: state.teamConfigModel.data,
    initing: state.loading.effects.contestantConfigModel.init,
    loading: state.loading.models.contestantConfigModel,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    fetch: async (data, mode = "fetch") => {
        if (mode === "init") {
            await dispatch.contestantConfigModel.init({
                filter: [],
                sort: [defaultSort],
                page: {current: 1, pageSize: 10}
            })
        }else{
            await dispatch.contestantConfigModel.init(data)
        }
        await dispatch.teamConfigModel.init()
    },
    /*编辑*/
    update: async (data) => {
        await dispatch.contestantConfigModel.update(data)
    },
    /*添加*/
    add: async (data) => {
        await dispatch.contestantConfigModel.add(data)
    },
    delete: async (data) => {
        await dispatch.contestantConfigModel.delete(data)
    },
})
export default connect(mapState, mapDispatch)(ContestantConfigPage);
