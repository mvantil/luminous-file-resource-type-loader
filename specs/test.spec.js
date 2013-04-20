var TypeLoader = require('../lib/luminous-file-resource-type-loader'),
    fs = require('fs');

describe("Luminous File typeLoader suite", function() {
    var typeLoader = new TypeLoader();

    it("must be able to load templates", function(done) {
        var fileReadResult = 'string result';
        spyOn(fs, 'readFile').andCallFake(function(fileName, callback) {
            expect(fileName).toBe('template/string.ko');
            callback(null, fileReadResult);
        });
        typeLoader.load('/string', function(err, typeLoader) {
            expect(err).toBeFalsy();
            expect(typeLoader).toBe(fileReadResult);
            done();
        });
    }, 1000);

    it("must be able to load parent templates", function(done) {
        var fileReadResult = 'Enum result';
        spyOn(fs, 'readFile').andCallFake(function(fileName, callback) {
            if (fileName == 'template/enum/test.ko') {
                return callback(new Error('ENOENT'));
            }
            else if (fileName == 'template/enum.ko') {
                return callback(null, fileReadResult);
            }
            callback(new Error('Unexpected file request: ' + fileName));
        });
        typeLoader.load('/enum/test', function(err, typeLoader) {
            expect(err).toBeFalsy();
            expect(typeLoader).toBe(fileReadResult);
            done();
        })
    });
});
