import React, {Component} from 'react';
import {Button, Col, Modal, Row, Spin, Table, Image, Descriptions, Divider} from "antd";
import {
    defaultSort,
    getColumnInputSearchProps,
    tableChange,
    getColumnSelectSearchProps,
    tableFetch, renderTime, getColumnTimeRangeSearchProps
} from "../../utils/core";
import {connect} from "react-redux";
import request, {getRegisterImgUrl, serverConfig} from "../../request/request";
import xl from 'excel4node'
import {DownloadOutlined, RetweetOutlined} from "@ant-design/icons";
import axios from "axios";

const headStyleConfig = {
    /* fill: {
         bgColor: 'rgb(91,155,213)'
     },*/
    font: {
        size: 12,
        bold: true
    },
    alignment: {
        horizontal: 'center',
        vertical: 'center'
    }
}

const cellStyleConfig = {
    alignment: {}
}

const exportExcel = async () => {
    const data = await tableFetch({
        sort: [{field: 'seq', order: 'asc'}],
        page: {current: 1, pageSize: 99999}
    }, "api2/registers", "registerInfoes", {field: 'seq', order: 'asc'})
    const wb = new xl.Workbook();
    const cellStyle = wb.createStyle(cellStyleConfig);
    const headStyle = wb.createStyle(headStyleConfig);

    let ws = wb.addWorksheet('Sheet 1');
    ws.cell(1, 1).string('序号').style(headStyle);
    ws.cell(1, 2).string('姓名').style(headStyle);
    ws.cell(1, 3).string('年龄').style(headStyle);
    ws.cell(1, 4).string('身份证号码').style(headStyle);
    ws.cell(1, 5).string('联系电话').style(headStyle);
    ws.cell(1, 6).string('地址（区域）').style(headStyle);
    ws.cell(1, 7).string('职业').style(headStyle);
    ws.cell(1, 8).string('个人/团体').style(headStyle);
    ws.cell(1, 9).string('成员数量').style(headStyle);
    ws.cell(1, 10).string('负责人联系方式').style(headStyle);
    ws.cell(1, 11).string('参赛节目及类型').style(headStyle);
    ws.cell(1, 12).string('媒体粉丝').style(headStyle);
    ws.cell(1, 13).string('图片').style(headStyle);
    ws.cell(1, 14).string('备注').style(headStyle);

    let i = 2
    if (data && data.data) {
        data.data.forEach(m => {
            ws.cell(i, 1).number(m.seq).style(cellStyle);
            ws.cell(i, 2).string(m.name).style(cellStyle);
            ws.cell(i, 3).number(m.age).style(cellStyle);
            ws.cell(i, 4).string(m.idCode).style(cellStyle);
            ws.cell(i, 5).string(m.phoneNumber).style(cellStyle);
            ws.cell(i, 6).string(m.region).style(cellStyle);
            ws.cell(i, 7).string(m.profession).style(cellStyle);
            ws.cell(i, 8).string(m.groupType).style(cellStyle);
            ws.cell(i, 9).number(m.memberCount).style(cellStyle);
            ws.cell(i, 10).string(m.groupType === "个人" ? m.phoneNumber : m.contactCode).style(cellStyle);
            ws.cell(i, 11).string(m.progType).style(cellStyle);
            ws.cell(i, 12).string(m.fans).style(cellStyle);
            ws.cell(i, 13).string(m.picturePath).style(cellStyle);
            ws.cell(i, 14).string(m.remarks).style(cellStyle);
            i++
        })
    }

    const fileName = "复星康养星潮达人报名表.xlsx";
    const buffer = await wb.writeToBuffer();
    let downloadUrl = window.URL.createObjectURL(new Blob([buffer]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.location.href = "download-picture"
}

const columns = ({operate, current, pageSize}) => [{
    title: '序号',
    dataIndex: 'seq',
    key: 'seq',
    render: (text, record, index) => (current - 1) * pageSize + parseInt(index) + 1
}, {
    title: "照片",
    dataIndex: "picturePath",
    key: "picturePath",
    render: value => value ? <Image width="48px"  style={{height: "48px"}} src={getRegisterImgUrl(value)}/> :
        <div/>
}, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    ...getColumnInputSearchProps("姓名")
}, {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    ...getColumnSelectSearchProps("性别", [{key: "男", value: "男"}, {key: "女", value: "女"}])
}, {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    sorter: true,
    ...getColumnInputSearchProps("年龄")
}, {
    title: '身份证号码',
    dataIndex: 'idCode',
    key: 'idCode',
    ...getColumnInputSearchProps("身份证号码")
}, {
    title: '联系电话',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    ...getColumnInputSearchProps("联系电话")
}, {
    title: '地址（区域）',
    dataIndex: 'region',
    key: 'region',
}, {
    title: '个人/团体',
    dataIndex: 'groupType',
    key: 'groupType',
    ...getColumnSelectSearchProps("个人/团体", [{key: "个人", value: "个人"}, {key: "团体", value: "团体"}])
}, {
    title: '参赛节目及类型',
    dataIndex: 'progType',
    key: 'progType',
    ...getColumnInputSearchProps("参赛节目及类型")
}, {
    title: '媒体粉丝',
    dataIndex: 'fans',
    key: 'fans',
    sorter: true,
}, {
    title: '报名时间',
    dataIndex: 'registerTime',
    key: 'registerTime',
    sorter: true,
    render: renderTime,
    ...getColumnTimeRangeSearchProps()
}, {
    title: '操作',
    dataIndex: 'seq',
    key: 'seq',
    render: (value, record) => <a onClick={operate.showDetail}>详情</a>
},]

const DetailView = props => (<Modal
    maskClosable={false}
    visible={props.visible}
    title={"详情信息"}
    footer={null}
    onCancel={props.onCancel}
    width={"800px"}>
    <Row>
        <Col span={8}>
            <div style={{padding: "20px"}}>
                <Image height="120px" width="120px"src={getRegisterImgUrl(props.data.picturePath)}/>
            </div>
        </Col>
        <Col span={16}>
            <Descriptions bordered column={2} labelStyle={{fontSize: '14px', fontWeight: "bold", height: "48px"}}>
                <Descriptions.Item label="姓名">{props.data.name || ""}</Descriptions.Item>
                <Descriptions.Item label="性别">{props.data.gender || ""}</Descriptions.Item>
                <Descriptions.Item label="年龄">{props.data.age || ""}</Descriptions.Item>
                <Descriptions.Item label="职业">{props.data.profession || ""}</Descriptions.Item>
                <Descriptions.Item label="身份证号码">{props.data.idCode || ""}</Descriptions.Item>
            </Descriptions>
        </Col>
    </Row>
    <Descriptions style={{marginTop: "20px"}} bordered column={2}
                  labelStyle={{fontSize: '14px', fontWeight: "bold", height: "48px"}}>
        <Descriptions.Item label="联系电话">{props.data.phoneNumber || ""}</Descriptions.Item>
        <Descriptions.Item label="微信号">{props.data.wxCode || ""}</Descriptions.Item>
        <Descriptions.Item label="手机号">{props.data.mobile || ""}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{props.data.email || ""}</Descriptions.Item>
        <Descriptions.Item label="地址">{props.data.region || ""}</Descriptions.Item>
        <Descriptions.Item label="参加节目类型">{props.data.progType || ""}</Descriptions.Item>
        <Descriptions.Item label="个人/团体">{props.data.groupType || ""}</Descriptions.Item>
        {props.data.groupType === "团体" ? <React.Fragment>
            <Descriptions.Item label="成员数量">{props.data.memberCount || ""}</Descriptions.Item>
            <Descriptions.Item label="责任人联系方式">{props.data.contactCode || ""}</Descriptions.Item>
        </React.Fragment> : <React.Fragment/>}
        <Descriptions.Item label="媒体粉丝">{props.data.fans || ""}</Descriptions.Item>
        <Descriptions.Item label="报名时间" span={2}>{renderTime(props.data.registerTime) || ""}</Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>{props.data.remarks || ""}</Descriptions.Item>
    </Descriptions>
</Modal>)

class RegisterInfoPage extends Component {
    state = {
        loading: false,
        selectRecord: undefined,
        modalVisibleState: {detailVisible: false},
        searchData: {filter: [], sort: [{field: 'seq', order: 'asc'}], page: this.props.page}
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
                        <Row>
                            <Col>
                                <Button type="primary" icon={<DownloadOutlined/>}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        onClick={async () => {
                                            await exportExcel()
                                        }}>导出</Button>
                            </Col>
                            <Col>
                                <Button type="primary" icon={<RetweetOutlined/>}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        onClick={() => {
                                            this.props.fetch(this.state.searchData)
                                        }}>刷新</Button>
                            </Col>
                        </Row>
                    </div>
                    <Spin tip={"正在加载。。。"} spinning={this.props.initing > 0 || this.props.loading > 0}>
                        <Table style={{padding: '0px 20px'}} bordered loading={this.state.loading}
                               size={'small'}
                               columns={columns({
                                   operate: {
                                       showDetail: () => {
                                           this.modalViewChange("detailVisible", true)
                                       }
                                   },
                                   ...this.props.page
                               })}
                               onRow={
                                   record => ({
                                       onClick: event => {
                                           this.setState({selectRecord: record})
                                       },
                                   })
                               }
                               dataSource={this.props.data}
                               onChange={(pagination, filters, sorts, extra) => tableChange(pagination, this.filterConvert(filters), sorts, extra, this)}
                               pagination={{...this.props.page}}/>
                    </Spin>
                </div>
                <DetailView data={this.state.selectRecord || {}} visible={this.state.modalVisibleState.detailVisible}
                            onCancel={() => this.modalViewChange("detailVisible", false)}/>
            </React.Fragment>
        );
    }
}

const mapState = (state, ownProps) => ({
    ...state.registerInfoConfig,
    initing: state.loading.effects.registerInfoConfig.init,
    loading: state.loading.models.registerInfoConfig,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    fetch: async (data) => {
        await dispatch.registerInfoConfig.init(data)
    },
})
export default connect(mapState, mapDispatch)(RegisterInfoPage);
