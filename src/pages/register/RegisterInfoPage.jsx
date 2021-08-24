import React, {Component} from 'react';
import {Button, Col, Row, Spin, Table} from "antd";
import {
    defaultSort,
    getColumnInputSearchProps,
    tableChange,
    getColumnSelectSearchProps,
    tableFetch
} from "../../utils/core";
import {connect} from "react-redux";
import request, {getRegisterImgUrl} from "../../request/request";
import xl from 'excel4node'
import {PlusOutlined} from "@ant-design/icons";
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
    }, "api/registers", "registerInfoes", {field: 'seq', order: 'asc'})
    const wb = new xl.Workbook();
    const cellStyle = wb.createStyle(cellStyleConfig);
    const headStyle = wb.createStyle(headStyleConfig);

    let ws = wb.addWorksheet('Sheet 1');
    ws.cell(1, 1).string('序号').style(headStyle);
    ws.cell(1, 2).string('姓名').style(headStyle);
    ws.cell(1, 3).string('年龄').style(headStyle);
    ws.cell(1, 4).string('身份证号码').style(headStyle);
    ws.cell(1, 5).string('联系电话').style(headStyle);
    ws.cell(1, 6).string('微信号').style(headStyle);
    ws.cell(1, 7).string('手机号').style(headStyle);
    ws.cell(1, 8).string('邮箱').style(headStyle);
    ws.cell(1, 9).string('地址（区域）').style(headStyle);
    ws.cell(1, 10).string('职业').style(headStyle);
    ws.cell(1, 11).string('个人/团体').style(headStyle);
    ws.cell(1, 12).string('成员数量').style(headStyle);
    ws.cell(1, 13).string('负责人联系方式').style(headStyle);
    ws.cell(1, 14).string('参赛节目及类型').style(headStyle);
    ws.cell(1, 15).string('媒体粉丝').style(headStyle);
    ws.cell(1, 16).string('图片').style(headStyle);
    ws.cell(1, 17).string('备注').style(headStyle);

    let i = 2
    if (data && data.data) {
        data.data.forEach(m => {
            ws.cell(i, 1).number(m.seq).style(cellStyle);
            ws.cell(i, 2).string(m.name).style(cellStyle);
            ws.cell(i, 3).number(m.age).style(cellStyle);
            ws.cell(i, 4).string(m.idCode).style(cellStyle);
            ws.cell(i, 5).string(m.phoneNumber).style(cellStyle);
            ws.cell(i, 6).string(m.wxCode).style(cellStyle);
            ws.cell(i, 7).string(m.mobile).style(cellStyle);
            ws.cell(i, 8).string(m.email).style(cellStyle);
            ws.cell(i, 9).string(m.region).style(cellStyle);
            ws.cell(i, 10).string(m.profession).style(cellStyle);
            ws.cell(i, 11).string(m.groupType).style(cellStyle);
            ws.cell(i, 12).string(m.memberCount).style(cellStyle);
            ws.cell(i, 13).string(m.groupType === "个人" ? m.phoneNumber : m.contactCode).style(cellStyle);
            ws.cell(i, 14).string(m.progType).style(cellStyle);
            ws.cell(i, 15).string(m.fans).style(cellStyle);
            ws.cell(i, 16).string(m.picturePath).style(cellStyle);
            ws.cell(i, 17).string(m.remarks).style(cellStyle);
            i++
        })
    }

    const fileName = "复星老人报名表.xlsx";
    const buffer = await wb.writeToBuffer();
    let downloadUrl = window.URL.createObjectURL(new Blob([buffer]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.location.href="download-picture"
}

const columns = [{
    title: '照片',
    dataIndex: 'picturePath',
    key: 'picturePath',
    render: value => value ? <img style={{height: '48px'}} src={getRegisterImgUrl(value)}/> : <div/>
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
    ...getColumnInputSearchProps("身份证号码")
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
    title: '成员数量',
    dataIndex: 'memberCount',
    key: 'memberCount',
    ...getColumnInputSearchProps("成员数量")
}, {
    title: '负责人联系方式',
    dataIndex: 'contactCode',
    key: 'contactCode',
    ...getColumnInputSearchProps("负责人联系方式")
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
},]

class RegisterInfoPage extends Component {
    state = {
        loading: false,
        searchData: {filter: [], sort: [{field: 'seq', order: 'asc'}], page: this.props.page}
    }

    componentWillMount() {
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
                <div className="site-layout-background"
                     style={{
                         height: '90vh'
                     }}>
                    <div style={{marginBottom: '10px', marginLeft: '10px'}}>
                        <Row gutter={10}>
                            <Col>
                                <Button type="primary" icon={<PlusOutlined/>}
                                        style={{marginLeft: '10px', marginTop: '20px'}}
                                        onClick={async () => {
                                            await exportExcel()
                                        }}>导出</Button>
                            </Col>
                        </Row>
                    </div>
                    <Spin tip={"正在加载。。。"} spinning={this.props.initing > 0 || this.props.loading > 0}>
                        <Table style={{padding: '0px 20px'}} bordered loading={this.state.loading}
                               columns={columns}
                               size={"small"}
                               dataSource={this.props.data}
                               onChange={(pagination, filters, sorts, extra) => tableChange(pagination, this.filterConvert(filters), sorts, extra, this)}
                               pagination={{...this.props.page}}/>
                    </Spin>
                </div>
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
