import React from 'react';
import {connect} from "react-redux";
import {Menu} from "antd";

const {SubMenu} = Menu;

const CustomMenu = props => {

    const [openKeys, setOpenKeys] = React.useState(['activeInfo']);
    let rootSubmenuKeys = []

    const onOpenChange = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const onSelect = async (select) => {
        let selectKey = select.key
        await props.linkTo(selectKey)
    }

    const menuMap = menuData => {
        if (!menuData) {
            return
        }
        rootSubmenuKeys = []
        const menus = []
        menuData.forEach(m => {
            let icon = m.icon;
            let title = m.title;
            let subMenus = m.subMenus;
            let disable = m.disable;

            if (subMenus !== null && subMenus !== undefined && subMenus.length > 0) {
                let menuItems = [];
                subMenus.forEach(n => {
                    menuItems.push(<Menu.Item content={n.content} disabled={n.disable}
                                              key={n.key}>{n.title}</Menu.Item>)
                })
                menus.push(<SubMenu key={m.key} icon={icon} disabled={disable} title={title}>{menuItems}</SubMenu>);
                rootSubmenuKeys.push(m.key);
            } else {
                menus.push(<Menu.Item key={m.key} disabled={disable} icon={icon}>{title}</Menu.Item>)
            }
        })
        return menus
    }

    return <Menu theme="dark" openKeys={openKeys} onOpenChange={onOpenChange} mode="inline" inlineIndent={18}
                 selectedKeys={props.selectMenuKey} onSelect={onSelect}>
        {menuMap(props.menus)}
    </Menu>

}

const mapState = (state, ownProps) => ({
    ...state.layoutConfig, ...ownProps
})

const mapDispatch = (dispatch) => ({
    init: () => dispatch.layoutConfig.init(),
    linkTo: async (key) => {
        await dispatch.layoutConfig.linkTo(key);
    }
})

export default connect(mapState, mapDispatch)(CustomMenu);
