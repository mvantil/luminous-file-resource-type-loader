var fs = require('fs'),
    Luminous = require('luminous-base'),
    Config = Luminous.Config,
    EventEmitter = require('events').EventEmitter;

function TypeResource() {
    var emitter = new EventEmitter();
    var config = new Config();

    config.load(function(err, data) {
        if (!data.typeResource || !data.typeResource.path) {
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

            fs.readFile(fileName, function (err, data) {
                callback(err, data ? data.toString() : null);
            });
        });
    };
}

module.exports = TypeResource;
