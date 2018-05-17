const Metalsmith = require('metalsmith');
const less = require('metalsmith-less');
const filter = require('metalsmith-filter');
const readFileSync = require('fs').readFileSync;
const basename = require('path').basename;


//simple metalsmith plugin for assets copy
copy_assets = function (assets, dist_dir) {
    return function (files, metalsmith, done) {
        assets.forEach(function (file) {
            contents = readFileSync(file);
            files[dist_dir + "/" + (basename(file))] = {
                contents: contents
            };
        });
        done();
    }
};


const build = Metalsmith(__dirname)
    .destination('public')
    .use(copy_assets(["node_modules/jquery/dist/jquery.min.js", "node_modules/foundation-sites/dist/js/foundation.min.js"], "js"))
    .use(copy_assets(["node_modules/foundation-sites/dist/css/foundation.min.css"], "css"))
    .use(less({
        pattern: [
            '**/main.less'
        ],
        render: {
            paths: [
                'src/css/'
            ],
            dumpLineNumbers: "comments",
            compress: true
        }
    }))
    .use(filter(['*', '**/*', '!**/*.less']));


build.build(function (err, files) {
    if (err) {
        throw err;
    }
});