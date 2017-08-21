/**
 * Created by binwang on 17/7/3.
 */

const tables = [
    'Entitymanager',
    'Entityfield',
    'Menu',
    'ModuleEditor',
    'I18n',
    'App',

    // 'User',
    // 'User',
    // 'BusinessDepartment',
    // 'Dict',
    // 'ServiceIntegration'
];
let Handlebars = require('handlebars');
let moment = require('moment');
let express = require('express');
let Mock = require('mockjs');
let fs = require('fs');
let os = require('os');
var bodyParser = require('body-parser');
const fileAsync = require('lowdb/lib/storages/file-async')
let low = require('lowdb');
let _ = require('lodash');

let db = low('mock/db_yj.json', {
    storage: fileAsync
})

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

Handlebars.registerHelper('if_eq', function (v1, v2, opts) {
    if (v1 === v2)
        return opts.fn(this);
    else
        return opts.inverse(this);
});
Handlebars.registerHelper('if_neq', function (v1, v2, opts) {
    if (v1 !== v2) {
        return opts.fn(this);
    } else
        return opts.inverse(this);
});

Handlebars.registerHelper('if_indexOf', function (v1, v2, opts) {
    if (v1.indexOf(v2) > -1) {
        return opts.fn(this);
    } else
        return opts.inverse(this);
});

function success(data) {
    return {
        success: true,
        content: data
    }
}

function fail(err) {
    return {
        success: true,
        errorMsg: err
    }
}

function log() {
    if (true)
        console.log(_.values(arguments));
}

function mockData() {
    //init db
    var dbs = {};
    _.forEach(tables, (t) => _.assign(dbs, {[t]: []}))
    db.defaults(dbs).write();

    db.defaults().forEach((m, v) => {
        tables.push(v);
    }).value();

    //init uri
    try {
        tables.map(t => {
            log(`init ${t}`);
            app.use('/api/' + t.toLowerCase() + '/:id', function (req, res) {
                log("req.params.id=" + req.params.id);
                if (req.method === 'GET') {
                    const post = db.get(t)
                        .find({id: _.parseInt(req.params.id)})
                        .value()
                    res.send(success(post))
                }
            });
            app.use('/api/' + t.toLowerCase(), function (req, res) {
                if (req.method === 'GET') {

                    let {sortOrder, pageSize, current, sortField} = req.query;
                    let condition = _.omit(req.query, ['sortOrder', 'pageSize', 'current', 'sortField'])
                    let value = db.get(t);
                    let total = 0;
                    if (_.keys(condition).length != 0) {
                        log('condition:', JSON.stringify(condition))
                        condition = _.mapValues(condition, function (m) {
                            var reg = /^[0-9]*$/;
                            if (reg.test(m))
                                return m * 1;
                            else
                                return m;
                        });
                        value = value.filter(condition)
                    }
                    total = value.size();
                    if (sortField) {
                        log('sortBy:', sortField)
                        value = value.sortBy(sortField)
                    }

                    if (sortOrder && sortOrder === 'ascend') {
                        log('sortOrder:', sortOrder);
                        value = value.reverse()
                    }

                    if (pageSize && current) {
                        log('pageSize:', pageSize)
                        value = value.slice((current - 1) * pageSize, current * pageSize);
                        res.send(success({
                            current: current,
                            total: total,
                            list: value.value()
                        }))
                    } else {
                        res.send(success(value.value()))
                    }

                } else if (req.method === 'POST') {
                    db.get(t)
                        .push(req.body)
                        .last()
                        .assign({id: Date.now()})
                        .write()
                        .then(post => res.send(success(post)))
                } else if (req.method === 'PUT') {
                    db.get(t)
                        .find({id: req.body.id})
                        .assign(req.body)
                        .write()
                        .then(post => res.send(success(post)))
                } else if (req.method === 'DELETE') {
                    if (_.isNumber(req.body.id)) {
                        db.get(t)
                            .remove({id: req.body.id})
                            .write()
                            .then(post => res.send(success(post)))
                    } else if (req.body.id === 'all') {
                        db.get(t).remove(() => 1 === 1).write().then(post => res.send(success(post)))
                    } else {
                        let ids = req.body.id.split(",");
                        db.get(t).remove((m) => {
                            return ids.indexOf(m.id + "") > -1;
                        }).write().then(post => res.send(success(post)))
                    }

                }
            });

        });
    } catch (e) {
        console.error(e);
    }
}

app.all('/api/codecreator', function (req, res) {
    if (req.method === 'POST') {
        let entitys = db.get('Entitymanager').filter((e) => {
            return _.indexOf(req.body.entitys, e.id) > -1
        }).value();

        let results = [];

        ['Action', 'Grid'].forEach(n => {
            let module = db.get('ModuleEditor').filter((e) => e.type === n).value();
            log(module)
            if (module.length > 0) {
                const template = Handlebars.compile(module[0].code);
                _.forEach(entitys, (e) => {

                    let fields = db.get('Entityfield').filter((f) => {
                        return f.entityId === e.id;
                    }).sortBy('order').value();

                    let selectFields = _.chain(fields).filter(f => {
                        return ( f.type === 'select' || f.type === 'radio' || f.type === 'checkbox' ) && !!f.select_option
                    }).uniqBy(f => f.select_option).value();


                    let config = {
                        NAME: e.name,
                        zh_name: e.zh_name,
                        lname: e.name.toLowerCase(),
                        fields: fields,
                        selectFields: selectFields,
                        user: os.hostname(),
                        date: moment(new Date()).format('YYYY-MM-DD')
                    };
                    let result = template(config);
                    log(result)
                    let directory = `${__dirname}/../src/${module[0].route}/${e.route}/`;
                    if (!fs.existsSync(directory)) {
                        fs.mkdirSync(directory);
                    }
                    db.defaults({[e.name]: []})
                        .write();
                    fs.writeFileSync(`${directory}${e.name}.js`, result);
                    results.push({
                        status: 'check',
                        path: `/src/${module[0].route}/${e.route}/${e.name}.js`
                    })
                    mockData();
                })
            }
        })

        res.json({
            success: true,
            content: results
        });
    }
});
app.all('/api/codeeditor', function (req, res) {
    if (req.method === 'GET') {
        let {path = null} = req.query;
        if (!!path) {
            let fileContent = fs.readFileSync(`${__dirname}/../src${path}`, 'utf-8');
            res.json({
                success: true,
                content: {
                    fileContent
                }
            })
        }
    } else if (req.method === 'POST') {
        let {path, fileContent} = req.body;
        fs.writeFileSync(`${__dirname}/../src${path}`, fileContent);
        res.json({
            success: true,
            content: {
                fileContent,
                path
            }
        })
    }
});
app.all('/api/login', function (req, res) {
    log(req.query)
    // setTimeout(() => {
    if (req.query.username === 'admin' && req.query.password === '000000') {

        res.json({
            success: true,
            content: {'username': 'admin', id: 1}
        });
    } else {
        res.json({
            success: false,
            errorMsg: 'username or password wrong !'
        });
    }
});

mockData();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.listen('8000');
