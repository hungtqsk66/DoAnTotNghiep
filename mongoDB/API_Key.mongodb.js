// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('audioServerDev');

//Create a new document in the collection.
// db.getCollection('ApiKeys').insertOne({
//     "key":"c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2",
//     "status":true,
//     "permissions":['GENERAL'],
//     "createdAt": new Date(),
//     "description":"General purpose uses",
//     "version":"v1"
// });

//db.ApiKeys.createIndex( { key: 1 }, { unique:true } )

// db.createCollection("ApiKeys",
//     {
//         validator: {
//            $jsonSchema: {
//             bsonType: "object",
//             required:["key","status","permissions","createdAt","description","version"],
//             properties:{
//                 key:{
//                     bsonType:"string",
//                     description:"Key must be a hashed string and required"
//                 },
//                 status:{
//                     bsonType:"bool",
//                     description:"status must be a boolean"
//                 },
//                 permissions:{
//                     bsonType:"array",
//                     description:"permissions must be an array of strings"
//                 },
//                 createdAt:{
//                     bsonType:"date"
//                 },
//                 description:{
//                     bsonType:"string"	
//                 },
//                 version:{
//                     bsonType:"string"
//                 }
//             }

//         }
//     }

// }
// );

