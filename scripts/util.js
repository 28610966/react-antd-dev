/**
 * Created by binwang on 17/8/14.
 */
var fs = require("fs");

//path模块，可以生产相对和绝对路径
var path = require("path");
var _ = require("lodash");

//读取文件存储数组
function readFilesInDir(dirUrl, option) {
    var fileArr = [];

    var {excludeFiles = []} = option;
    var {format = null} = option;
    var {prefix = ''} = option;

    function exclude(file) {
        return !_.includes(excludeFiles, file);
    }

//获取文件数组
    function readFile(readurl, name) {
        var name = name;
        let files = fs.readdirSync(readurl);

        files.forEach(function (filename) {
            let stats = fs.statSync(path.join(readurl, filename));
            if (stats.isFile() && exclude(filename)) {
                if (!!option.format && _.isFunction(option.format))
                    filename = option.format(filename);
                var newUrl = name + '/' + filename;
                fileArr.push({name: filename, fullName: newUrl});
                //是子目录
            } else if (stats.isDirectory()) {
                var dirName = filename;
                readFile(path.join(readurl, filename), name + '/' + dirName);
            }
        });
    }

    readFile(dirUrl, prefix);
    return _.sortBy(fileArr,(f) => f.fullName);
}

module.exports = {readFilesInDir: readFilesInDir};