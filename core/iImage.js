var Q = require('q'),
    fs = require('fs-extra'),
    Canvas = require('canvas'),
    Image = Canvas.Image,
    utils = require('./utils.js'),
    _ = require('lodash');

var IImage = module.exports = function(file, config, root) {
    this.file = file;
    this.config = config || utils.defaults;
    this.root = root || process.cwd();
};

IImage.prototype = {
    constructor: IImage,

    init: function() {
        var self = this,
            file = this.root + this.file;
        return Q.denodeify(fs.exists)(file)
            .then(function(exists) {
                if (!exists) {
                    throw '文件' + file + '不存在';
                }
            }, function() {})
            .then(function() {
                return Q.denodeify(fs.readFile)(file)
            })
            .then(function(image) {
                var img = new Image();
                img.src = image;
                self.oriWidth = img.width;
                self.oriHeight = img.height;
                self._resize();
            })
            .catch(function() {
                console.log(arguments);
            })
    },

    _resize: function() {
        var config = this.config,
            width = this.oriWidth + config['padding-left'] + config['padding-right'],
            height = this.oriHeight + config['padding-top'] + config['padding-bottom'];

        var float = config['float'];

        this.width = width;
        this.height = height;
        this.float = float;
    }
};
