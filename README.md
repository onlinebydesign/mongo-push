# mongo-push
Push the changes from one Mongodb collection to another. 

## Installation
###### To be implemented
```
npm install mongo-push
```

### Database Setup
You will need to add an indexed field to your collections. This field will be for you to store the last time the document was updated.
This field is how mongo-push tracks what needs to be updated so it is critical that this is updated every time you change anything.

## Usage
```
// Copies changes from the src database to the dst database for all collections. 
var mongoPush = require('mongo-push')();
mongoPush({
    src: 'mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]',
    dst: 'mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]'
} function (err) {
    if (err) console.error(err);
});

// Copies changes from the src database to the dst database for the 'test' collection. 
var mongoPush = require('mongo-push')();
mongoPush({
    src: 'mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]',
    dst: 'mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]',
    collections: ['test']
} function (err) {
    if (err) console.error(err);
});
```

### Available Options
```
// Global options 
{}

// Per run options
{}
```
