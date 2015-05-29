var mongoPush = new require('mongo-push')();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var moment = require('moment');
var async = require('async');

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
            }, function (err, results) {
                if (err) return cb(err);

                srcCol.find().toArray(function (err, srcData) {
                    if (err) return cb(err);

                    dstCol.find().toArray(function (err, dstData) {
                        if (err) return cb(err);

                        // Return the data for both the source and the destination database
                        return cb(null, {srcData: srcData, dstData: dstData, results: results});
                    });
                });
            });
        };

        // TODO: Ensure collections are empty

        /**
         *  Start the assertions
         */
        async.series([
            function (done) {
                // If unable to connect to either database it should return an error
                mongoPush.sync({
                    src: src,
                    dst: dst
                }, function (err, results) {
                    assert.ok(err, 'Should return an error');
                    assert.ok(!results, 'Should not return any results');
                    done();
                });
            },
            function (done) {
                // If source is empty then it should update 0 rows
                doSync(function (err, results) {
                    assert.equal(err, null, 'Shouldn\'t return an error');
                    assert.equal(results.results.rowsUpdated, 0, 'Should return that no rows were updated');
                    assert.equal(results.srcData.length, 0, 'Source should be empty');
                    assert.equal(results.dstData.length, 0, 'Destination should be empty');
                    done();
                });
            },
            function (done) {
                // After inserting a document it should update 1 row
                srcCol.insertOne({_u: moment().unix(), name: 'Row 1'}, function (err, result) {
                    assert.equal(err, null, 'Shouldn\'t return an error');

                    doSync(function (err, results) {
                        assert.equal(err, null, 'Shouldn\'t return an error');
                        assert.equal(results.results.rowsUpdated, 1, 'Should return that 1 row was updated');
                        assert.deepEqual(results.srcData, results.dstData, 'Source and destination should be the same');
                        done();
                    });
                });
            },
            function (done) {
                // After inserting 2 more documents it should update 2 rows
                srcCol.insertMany([{_u: moment().unix(), name: 'Row 2'}, {_u: moment().unix(), name: 'Row 3'}], function (err, result) {
                    assert.equal(err, null, 'Shouldn\'t return an error');

                    doSync(function (err, results) {
                        assert.equal(err, null, 'Shouldn\'t return an error');
                        assert.equal(results.results.rowsUpdated, 2, 'Should return that 2 rows were updated');
                        assert.deepEqual(results.srcData, results.dstData, 'Source and destination should be the same');
                        done();
                    });
                });
            }],
            function (err, results) {
                // TODO: Remove databases
            }
        );
    });
});



