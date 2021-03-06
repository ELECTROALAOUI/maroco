/**
 * API mock
 */
(function() {
    //test
    Mock.mock('/json/members', 'get', {
        "total|200": 12,
        "data|2-10": [{
            'id|+1': 12,
            "cname": '@WORD',
            "address": "@TITLE",
            "size|10000-10000000000.1-2":100,
            "label|1-3": '★',
            "avanta": '@IMAGE',
            "from": '@STRING(3,8)',
            "sender": '@NAME',
            "sendtime": '@DATE("yyyy-MM-dd hh:mm:ss")'
        }]
    });
    //组织树
    /*[{
        id: top.USER.orgId,
        isParent: true,
        leaf: false,
        name: top.USER.orgName
    }]*/
    Mock.mock(/\/json\/getTree(\?.*)?/, 'get', {
        "total|200": 12,
        "result|5-6": [{
            'id|+1': 12,
            "isParent": "@BOOLEAN",
            "type": "@BOOLEAN", //是否是公司
            "name": '@NAME'
        }]
    });
    ///json/getUserByOrgId 获取部门下人员
    //Random.image('200x100', '#ffcc33', '#FFF', 'png', '!')
    Mock.mock('/json/getUserByOrgId', 'get', {
        "total|200": 12,
        "data|20": [{
            'id': '@GUID',
            "sex|0-1": '@integer',
            "userName": '@WORD',
            "loginName": "@WORD",
            "avanta": '@IMAGE(48,"#00405d","#fff","png","&#9787;")',
            "address": '@AREA @REGION',
            "cardId": '@ID',
            "orgs": [{
                orgId: 'org1',
                orgName: '@WORD'
            }, {
                orgId: 'org2',
                orgName: '@WORD'
            }],
            "roles": [{
                "id": "@GUID",
                "name": "@WORD",
                "power": '@boolean',
                "description": '@WORD',
                "orgName": '部门:@WORD', //所属部门或者组织
                "orgId": '@GUID'
            }, {
                "id": "@GUID",
                "name": "@WORD",
                "power": '@boolean',
                "description": '@WORD',
                "orgName": '部门:@WORD', //所属部门或者组织
                "orgId": '@GUID'
            }],
            "reserveA": '@WORD',
            "mobile": "1@STRING('number',10,10)",
            "email": '@EMAIL',
            "sendtime": '@DATE("yyyy-MM-dd hh:mm:ss")'
        }]
    });

    //根据组织ID返回所有权限(role.js用到)
    Mock.mock(/\/json\/getRoleByOrgIds(\?.*)?/, 'get', {
        "total": 12,
        "data|2-5": [{
            "id": "@GUID",
            "name": "@WORD",
            "power": '@boolean',
            "description": '@WORD',
            "orgName": '部门:@WORD', //所属部门或者组织
            "orgId": 'org1'
        }, {
            "id": "@GUID",
            "name": "@WORD",
            "power": '@boolean',
            "description": '@WORD',
            "orgName": '部门:@WORD', //所属部门或者组织
            "orgId": 'org2'
        }]
    });
    //根据组织ID返回所有权限(map形式返回)
    Mock.mock(/\/json\/getRoleMapByOrgIds(\?.*)?/, 'get', {
        "total": 12,
        "data|2-5": [{
            'orgId':'org1',
            'orgName':'@WORD',
            'roles|3-6':[{
                "id": "@GUID",
                "name": "@WORD",
                "power": '@boolean',
                "description": '@WORD',
                "orgName": '部门:@WORD', //所属部门或者组织
                "orgId": 'org1'
            }]
        },{
            'orgId':'org2',
            'orgName':'@WORD',
            'roles|3-6':[{
                "id": "@GUID",
                "name": "@WORD",
                "power": '@boolean',
                "description": '@WORD',
                "orgName": '部门:@WORD', //所属部门或者组织
                "orgId": 'org2'
            },{
                "id": "@GUID",
                "name": "@WORD",
                "power": '@boolean',
                "description": '@WORD',
                "orgName": '部门:@WORD', //所属部门或者组织
                "orgId": 'org3'
            }]
        }]
    });
    //根据角色ID返回所有权限 app  model fun
    Mock.mock(/\/json\/getPowers(\?.*)?/, 'get', {
        "total": 12,
        "data|1-2": [{
            "id": "@GUID",
            "name": "@WORD",
            "models|3-9": [{
                "id": "@GUID",
                "name": "@WORD",
                "funs|4-8": [{
                    "id": "@GUID",
                    "name": "@WORD",
                    "power": '@boolean' //是否具有权限
                }]
            }]
        }]
    });


})();
