var fs = require('fs'),
    Luminous = require('luminous-base'),
    Config = Luminous.Config,
    EventEmitter = require('events').EventEmitter,
    async = require('async'),
    _ = require('underscore');

function TypeResource() {
    var emitter = new EventEmitter();
    var config = new Config();

    config.load(function(err, data) {
        if (!err && (!data.typeResource || !data.typeResource.path)) {
            err = new Error("Type Resource path not specified in configuration.");
        }

        emitter.emit('configLoaded', err, data);
        emitter.on('newListener', function(eventName, listener) {
            if (eventName == 'configLoaded') {
                listener(err, data);
            }
        });
    });

    this.load = function(type, callback) {
        if (!type || !type.length) {
            throw new Error('Missing type');
        }
        emitter.once('configLoaded', function(err, config) {
            if (err) {
                if (callback) return callback(err);
                throw err;
            }

            var path = config.typeResource.path;
            var extension = config.typeResource.extension;

            var fileName = path.length ? path : '.';
            fileName += type[0] == '/' ? type : ('/' + type);
            fileName += extension && extension.length ? ('.' + extension) : '';

            var typeData;
            var typeParts = type.split('/');

            async.whilst(function() {
                return !typeData;
            }, function(callback) {
                var fileName = path.length ? path : '.';
                _.chain(typeParts)
                .filter(function(item) {
                    return item.length;
                }).each(function(item) {
                    fileName += '/' + item;
                });
                fileName += extension && extension.length ? ('.' + extension) : '';

                fs.readFile(fileName, function(err, data) {
                    if (!err) {
                        typeData = data.toString();
                    } else {
                        if (typeParts.length <= 2) {
                            return callback(new Error('Did not locate a resource file'));
                        }
                        typeParts.splice(typeParts.length - 1, 1);
                    }
                    callback();
                })
            }, function(err) {
                callback(err, typeData);
            });
        });
    };
}

module.exports = TypeResource;
