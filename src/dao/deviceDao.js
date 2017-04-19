/**
 * Created by zhubg on 2017/4/17.
 */

'use strict';

//permission to kill
var tokill = {tokill: ['_rev', '_id', '_key']};

//连接DB
import {db} from '../util/database';

//userDao
export function deviceDao( module, method, params) {
    //code

    //promise
    console.log('deviceDao');
    return dao[method](module, method, params);
}

//功能Dao--start--
let dao = {};

//getUserByAccountName
dao.getUserByAccountName = function (module, method, params) {
    //some code
    console.log('userDao-getUserByAccountName');
    if (params.accountName) {
        var accountName = params.accountName;
        var AQL = `
                    For i in user
                        FILTER i.accountName == "${accountName}"
                            return UNSET(i,@tokill)
                  `;
        //promise
        return db.query(AQL, tokill).then(function (cursor) {
            return cursor.all();
        });
    } else {
        throw 'params.accountName Undefined!Check it!';
    }
};

//insertUser
dao.insertDevice = function (module, method, params) {
    //some code
    console.log('deviceDao-insertDevice');
    if (params.user) {
        let user = JSON.stringify(params.user);
        var AQL = `
            INSERT ${user}
            IN user
            return NEW
        `;
        console.log('AQL:' + AQL);

        //promise
        return db.query(AQL)
            .then((cursor)=> {
                return cursor.all()
            });
    } else {
        throw `params.user Undefined!Check it!`;
    }
};

//updateTokenByAccountName
dao.updateTokenByAccountName = function ( module, method, params) {
    //some code
    console.log('userDao-updateTokenByAccountName');
    if (params.accountName && params.token) {
        let accountName = params.accountName;
        let token = params.token;
        var AQL = `
        For i in user
            FILTER i.accountName == "${accountName}"
            UPDATE i WITH {token:"${token}"} IN user
            return UNSET(NEW,@tokill)
        `;
        console.log('AQL:' + AQL);

        //promise
        return db.query(AQL, tokill)
            .then((cursor)=> {
                return cursor.all()
            });
    } else {
        throw `params.accountName or params.token Undefined!Check it!`;
    }
};

//updateGoldPointsByAccountName
dao.updateGoldPointsByAccountName = function ( module, method, params) {
    //some code
    console.log('userDao-updateGoldPointsByAccountName');
    if (params.accountName && params.additionGoldPoints) {
        let accountName = params.accountName;
        let additionGoldPoints = params.additionGoldPoints;
        // var AQL = `
        // For i in user
        //     FILTER i.accountName == "${accountName}"
        //     UPDATE i WITH {goldPoints:i.goldPoints+${additionGoldPoints}} IN user
        //     return NEW
        // `;
        // console.log('AQL:' + AQL);
        // console.log(typeof AQL);
        //启用事务
        var action = String(function () {
            // This code will be executed inside ArangoDB!
            const db = require("@arangodb").db;
            return db._query(' For i in user    FILTER i.accountName == "'+ params["accountName"] +'"    UPDATE i WITH {goldPoints:i.goldPoints+'+params["additionGoldPoints"]+'} IN user   return UNSET(NEW, "_key", "_id", "_rev") ').toArray();
        });

        return db.transaction({write: "user",allowImplicit: false}, action,{accountName:accountName,additionGoldPoints:additionGoldPoints})
            .then(result => {
                // result contains the return value of the action
                // console.log(Promise.resolve(result));
                return Promise.resolve(result);
            });
    } else {
        throw `params.accountName or params.newGoldPoints Undefined!Check it!`;
    }
};

//updateGoldPointsByGainBonusRecordList
dao.updateGoldPointsByGainBonusRecordList = function ( module, method, params) {
    //some code
    console.log('userDao-updateGoldPointsByGainBonusRecordList');
    if (params.gainBonusRecordList) {
        let gainBonusRecordList =JSON.stringify(params.gainBonusRecordList);
        //启用事务
        var action = String(function () {
            // This code will be executed inside ArangoDB!
            const db = require("@arangodb").db;
            return db._query('For i in '+params["gainBonusRecordList"]+'    For j in user    FILTER j.accountName == i.accountName    UPDATE j WITH {goldPoints:j.goldPoints+i.gainBonusSum} IN user   return UNSET(NEW, "_key", "_id", "_rev") ').toArray();
        });

        return db.transaction({write: "user",allowImplicit: false}, action,{gainBonusRecordList:gainBonusRecordList})
            .then(result => {
                // result contains the return value of the action
                // console.log(Promise.resolve(result));
                return Promise.resolve(result);
            });
    } else {
        throw `params.gainBonusRecordList Undefined!Check it!`;
    }
};

//功能Dao---end---