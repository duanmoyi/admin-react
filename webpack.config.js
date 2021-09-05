var path = require('path');
var webpack = require('webpack');

var ROOT_PATH = path.resolve(__dirname);
var ENTRY_PATH = path.resolve(ROOT_PATH);
var OUTPUT_PATH = path.resolve(ROOT_PATH, 'public/dist/');

var system = {
    devtool: "inline-source-map",
    mode: "development",
    entry: {
        system: path.resolve(ENTRY_PATH, 'src/index.js')
    },
    output: {
        path: OUTPUT_PATH,
        filename: '[name].js',
    },
    node: {
        net: 'empty',
        fs:'empty'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx|.js?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', "react", "es2015"],
                    }
                },
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },{
                test: /\.less$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS
                }, {
                    loader: 'less-loader', // compiles Less to CSS
                    options: {
                        lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                            modifyVars: {
                                'primary-color': '#077d9c',
                                'link-color': '#077d9c',
                                'border-radius-base': '2px',
                                'success-color': '#52c41a', // 成功色
                                'warning-color': '#faad14', // 警告色
                                'error-color': '#f5222d', // 错误色
                                'font-size-base': '14px', // 主字号
                                'heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
                                'text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
                                'text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
                                'disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
                                'layout-header-background': '#003746',
                                'layout-menu-background': '#033c52',
                                'layout-sider-background': '#033c52',
                                'layout-sider-background-light': '#033c52',
                                'layout-trigger-color': '#1490bf',
                                'layout-trigger-background': '#32515e',
                                'select-item-selected-color': '#45e1d6',
                                'menu-inline-submenu-bg': '#033c52',
                                'menu-inline-bg': '#033c52',
                                'menu-bg': '#033c52',
                                'menu-item-color': '#fff',
                                'border-color-base': '#d9d9d9', // 边框色
                                'box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),0 9px 28px 8px rgba(0, 0, 0, 0.05)', // 浮层阴影
                                // Layout
                                'layout-body-background': '#d2e4f5',
                                'body-background': '#68a8e2',
                            },
                            javascriptEnabled: true,
                        },
                    },
                }]
            }]
    }
}

module.exports = system;
