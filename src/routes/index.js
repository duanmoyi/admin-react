import {Home} from "../pages/home";
import {Header} from "../pages/home";
import {renderRoutes} from "react-router-config";
import {Login} from "../pages/login";
import {createRoutes} from "../utils/core";


const HomePageRoute = {
    path: ['', '/home'],
    component: Home,
    children:[{
        path: ['/header'],
        component: Header,
    }]
}


const LoginPageRoute = {
    path: '/login',
    component: Login,
}

const AppRoute = [LoginPageRoute, HomePageRoute]

export default renderRoutes(createRoutes(AppRoute))
