var mongoPush = require('mongo-push')();
var assert = require('assert');

var doSync = function (cb) {
    mongoPush({
        src: 'mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]',
        dst: 'mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]'
    }, function (err) {
        if (err) return err;
    });

};


