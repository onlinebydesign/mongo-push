var mongoPush = new require('mongo-push')();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var src = 'mongodb://localhost/mongoPushTest1';
var dst = 'mongodb://localhost/mongoPushTest2';

// To run the test we need to connect to the mongo databases
MongoClient.connect(src, function(err, srcDb) {
    assert.equal(err, null);
    console.log("Connected to source database");
    var srcCol = srcDb.collection('test');
    MongoClient.connect(src, function(err, dstDb) {
        assert.equal(err, null);
        console.log("Connected to destination database");
        var dstCol = dstDb.collection('test');

        var doSync = function (cb) {
            mongoPush.sync({
                src: src,
                dst: dst
            }, function (err) {
                if (err) return cb(err);

                srcCol.find().toArray(function (err, srcData) {
                    if (err) return cb(err);

                    dstCol.find().toArray(function (err, dstData) {
                        if (err) return cb(err);

                        // Return the data for both the source and the destination database
                        return cb(null, {srcData: srcData, dstData: dstData});
                    });
                });
            });
        };


        /**
         *  Start the assertions
         */

        // If unable to connect to either database it should return an error
        mongoPush.sync({
            src: src,
            dst: dst
        }, function (err, results) {
            assert.ok(err, 'Should return an error');
            assert.ok(!results, 'Should not return any results')
        })
    });
});



