/**
 * Created by binwang on 17/8/16.
 */
 const menus = [{
    "id": 1,
    "title": "平台",
    "icon": "desktop",
    "path": "/desktop",
    "role": "1",
    "children": [{ "id": 2, "title": "租户管理", "path": "/tenant_management" }, {
        "id": 3,
        "title": "系统配置",
        "path": "/system_setting"
    }]
}, {
    "id": 4,
    "title": "租户",
    "icon": "user",
    "role": "2",
    "children": [{ "id": 5, "title": "组织管理", "path": "/org_management" }, {
        "id": 6,
        "title": "人员管理",
        "path": "/user_management"
    }, { "id": 7, "title": "权限管理", "path": "/right_management" }]
}, {
    "id": 8,
    "title": "配置",
    "icon": "setting",
    "group": "soft",
    "role": "3",
    "children": [{ "id": 9, "title": "服务管理", "path": "/service_management" }, {
        "id": 10,
        "title": "服务组管理",
        "path": "/service_group_management"
    }, { "id": 11, "title": "事件源管理", "path": "/event_source_management" }, {
        "id": 12,
        "title": "策略管理",
        "path": "/strategy_management"
    }, { "id": 13, "title": "排班管理", "path": "/workforce_management" }]
}, {
    "id": 14,
    "title": "审计",
    "group": "audit",
    "role": "4",
    "icon": "area-chart",
    "children": [{ "id": 15, "title": "统计分析", "path": "/service_group" }, { "id": 16, "title": "操作审计", "path": "/service" }]
}, {
    "id": 17,
    "title": "运维",
    "group": "opt",
    "role": "5",
    "icon": "setting",
    "children": [{ "id": 18, "title": "告警管理", "path": "/alarm_management" }, {
        "id": 19,
        "title": "事故管理",
        "path": "/accident_management"
    }, { "id": 20, "title": "事件管理", "path": "/event_management" }, {
        "id": 21,
        "title": "通知管理",
        "path": "/notice_management"
    }, { "id": 13, "title": "告警策略", "path": "/alarm_strategy" }]
}];

export default menus;