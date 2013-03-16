var TypeLoader = require('../lib/luminous-file-resource-type-loader'),
    fs = require('fs');

describe("Luminous File typeLoader suite", function() {
    var typeLoader = new TypeLoader();

    it("must be able to load templates", function(done) {
        var fileReadResult = 'Fake result';
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
});
