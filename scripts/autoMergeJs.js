/**
 * Created by binwang on 17/7/11.
 * auto create saga and reducer index.js
 */

let fs = require('fs');
let Handlebars = require('handlebars');
let _ = require('lodash');
let util = require('./util');

function AutoMergeJs(options) {
}
AutoMergeJs.prototype.apply = function (compiler) {
    compiler.plugin('emit', function (compilation, callback) {


        function createIndex(src, targetFile) {
            let files = util.readFilesInDir(src, {
                prefix: '.',
                excludeFiles: ['index.js', 'index.tpl'],
                format: (f) => f.substring(0, f.length - 3)
            });

            targetFile.forEach(f => {
                let data = fs.readFileSync(src + "/" + f.template, 'utf-8');
                const template = Handlebars.compile(data);
                let result = template({
                    list: files
                });
                let old = fs.readFileSync(src + "/" + f.target, 'utf-8');
                if (old !== result)
                    fs.writeFileSync(src + "/" + f.target, result);
            })

        }

        let _targetFile = [{
            template: 'index.tpl',
            target: 'index.js',
        }];
        createIndex('./src/actions', _targetFile);
        createIndex('./src/components/pages', _targetFile);
        callback();
    });
};

module.exports = AutoMergeJs;