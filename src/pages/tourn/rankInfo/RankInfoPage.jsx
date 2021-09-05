import React, {Component} from 'react';
import {Image, Tabs, Spin, Table, Select} from "antd";
import {connect} from "react-redux";
import {
    defaultSort,
    getColumnInputSearchProps,
    getColumnSelectSearchProps,
    getImgUrl,
    tableChange
} from "../../../utils/core";

const {TabPane} = Tabs;

const getDefaultActiveStage = (stageData) => {
    if (stageData && stageData.length > 0) {
        let occurActiveStage = stageData.filter(m => m.status === "正在进行")
        if (occurActiveStage.length > 0) {
            return occurActiveStage[0].id
        }
        return stageData[0].id
    }
}

const totalColumns = teamData => [
    {
        title: '排名',
        dataIndex: 'totalRanking',
        key: 'totalRanking',
        // sorter: true
    }, {
        title: '人气值',
        dataIndex: 'totalVotes',
        key: 'totalVotes',
        // sorter: true
    }, {
        title: '头像',
        dataIndex: 'contestantAvatar',
        key: 'contestantAvatar',
        render: value => value ? <Image width="48px" src={getImgUrl(value)}/> : <div/>,
    }, {
        title: '姓名',
        dataIndex: 'contestantName',
        key: 'contestantName',
        // ...getColumnInputSearchProps("姓名")
    }, {
        title: '战队',
        dataIndex: 'teamName',
        key: 'teamName',
        // sorter: true,
        // ...getColumnSelectSearchProps("战队", teamData.map(m => ({
        //     key: m.teamName + "（" + m.name + "）",
        //     value: m.teamId
        // })))
    }]

const stageColumns = teamData => [
    {
        title: '排名',
        dataIndex: 'stageRanking',
        key: 'stageRanking',
        sorter: true
    }, {
        title: '人气值',
        dataIndex: 'stageVotes',
        key: 'stageVotes',
        sorter: true
    }, {
        title: '头像',
        dataIndex: 'contestantAvatar',
        key: 'contestantAvatar',
        render: value => value ? <Image width="48px" src={getImgUrl(value)}/> : <div/>,
    }, {
        title: '姓名',
        dataIndex: 'contestantName',
        key: 'contestantName',
        ...getColumnInputSearchProps("姓名")
    }, {
        title: '战队',
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: true,
        ...getColumnSelectSearchProps("战队", teamData.map(m => ({
            key: m.teamName + "（" + m.name + "）",
            value: m.teamId
        })))
    }]

class RankInfoPage extends Component {

    state = {
        loading: false,
        searchData: {filter: [], sort: [defaultSort], page: this.props.totalRankData.page},
    }

    componentWillMount() {
        this.props.fetchTotalData(this.state.searchData)
    }

    tabsChange = async key => {
        if (key === "2") {
            await this.props.fetchStageData(this.state.selectStageId || getDefaultActiveStage(this.props.stageData))
        }
    }

    selectStage = async (data) => {
        this.setState({selectStageId: data})
        await this.props.fetchStageData(data)
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
                <div className="site-layout-background" style={{padding: '10px 30px'}}>
                    <Tabs defaultActiveKey="1" onChange={this.tabsChange}>
                        <TabPane tab="选手总排名" key="1">
                            <Spin tip={"正在加载。。。"} spinning={this.props.totalDataIniting > 0 || this.props.loading > 0}>
                                <Table bordered loading={this.state.loading}
                                       columns={totalColumns(this.props.teamData)}
                                       dataSource={this.props.totalRankData.data}
                                       onChange={(pagination, filters, sorts, extra) => tableChange(pagination, this.filterConvert(filters), sorts, extra, this)}
                                       pagination={{...this.props.totalRankData.page}}/>
                            </Spin>
                        </TabPane>
                        <TabPane tab="选手阶段排名" key="2">
                            <Select
                                style={{width: 200, marginBottom: "20px"}}
                                placeholder="选择活动阶段"
                                optionFilterProp="children"
                                onChange={this.selectStage}
                                value={this.state.selectStageId || getDefaultActiveStage(this.props.stageData)}
                            >
                                {this.props.stageData.map(m => <Option value={m.id}>{m.name}</Option>
                                )}
                            </Select>,
                            <Spin tip={"正在加载。。。"} spinning={this.props.stageDataIniting > 0 || this.props.loading > 0}>
                                <Table bordered loading={this.state.loading}
                                       columns={stageColumns(this.props.teamData)}
                                       dataSource={this.props.stageRankData}/>
                            </Spin>
                        </TabPane>
                    </Tabs>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = (state, ownProps) => ({
    totalRankData: state.rankInfoConfig.totalData,
    stageRankData: state.rankInfoConfig.stageData,
    teamData: state.teamConfigModel.data,
    totalDataIniting: state.loading.effects.rankInfoConfig.initTotalData,
    stageDataIniting: state.loading.effects.rankInfoConfig.initStageData,
    stageData: state.activeStageConfigModel.data,
    loading: state.loading.models.rankInfoConfig,
    ...ownProps
})

const mapDispatch = (dispatch) => ({
    fetchTotalData: async (data) => {
        await dispatch.rankInfoConfig.initTotalData(data)
        await dispatch.teamConfigModel.init()
        await dispatch.activeStageConfigModel.init({
            filter: [],
            sort: [{field: 'startTime', order: 'desc'}],
            page: {current: 1, pageSize: 999}
        })
    },
    fetchStageData: async (data) => {
        await dispatch.rankInfoConfig.initStageData(data)
    },
})
export default connect(mapState, mapDispatch)(RankInfoPage);
