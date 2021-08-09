export const createRoutes = routeConfig => {
    if (routeConfig instanceof Array) {
        let routes = []
        routeConfig.forEach(m => {
            createRoutes(m).forEach(n => routes.push(n))
        })
        return routes
    }

    let children = routeConfig.children || []
    delete routeConfig.children

    let routes = [{...routeConfig, exact: true}]
    children.forEach(m => {
        let path = m.path
        if (Array.isArray(routeConfig.path)) {
            m.path = routeConfig.path.map(n => n.concat(path))
        } else {
            m.path = routeConfig.path.concat(path)
        }
        createRoutes(m).forEach(n => routes.push(n))
    })

    return routes
}
