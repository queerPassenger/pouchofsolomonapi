const {getDbData,dbCollectionSet} = require('../mongoUtilities/dbDetails');
const dbConnect = require('../services/dbConnectService');
const dbCollectionData=dbCollectionSet[0];
const dbName=dbCollectionData.db;
const dbDetailsToConnect = getDbData(dbName);
const { errorConstants } = require('../constants');
const ObjectID = require('mongodb').ObjectID;

const getList = (collectionName,cb) => {
    try {
      dbConnect(dbDetailsToConnect, (dbClient) => {
          dbClient.db(dbDetailsToConnect.db_name).collection(collectionName).find({},{_id:0}).toArray((err,result)=>{
              if(err){
                  console.log(errorConstants.getListFailure+'- '+collectionName);
                  return cb({
                      status:false,
                      msg:errorConstants.getListFailure
                  })
              }
              else{
                return cb({
                    status:true,
                    msg:'',
                    data:result
                })
              }
          })
              
      });
          
    } catch (error) {
      console.log(error);
    }
};
const createTransaction=(collectionName,queryObj,payload,cb)=>{
  try {
    payload.map((data)=>{
      data['userId']=queryObj.id;
      data['createdTimeStamp']=new Date(data['createdTimeStamp']);
      data['timeStamp']=new Date(data['timeStamp']);
      let objId=new ObjectID();
      data['transactionId']=objId.toString();
    });
    dbConnect(dbDetailsToConnect, (dbClient) => {
        dbClient.db(dbDetailsToConnect.db_name).collection(collectionName).insertMany(payload,(err,result)=>{
            if(err){
                return cb({
                    status:false,
                    msg:errorConstants.updateTransactionFailure
                })
            }
            else{
              return cb({
                  status:true,
                  msg:'Successfully Recorded',
                  
              })
            }
        })
            
    });
        
  }
  catch (error) {
    console.log(error);
  }
}
const getTransaction=(collectionName,queryObj,payload,cb)=>{
  try {

    dbConnect(dbDetailsToConnect, (dbClient) => {
        dbClient.db(dbDetailsToConnect.db_name).collection(collectionName).find({$and:[{userId:queryObj.id},{'timeStamp':{$gte:new Date(payload.fromDate),$lte:new Date(payload.toDate)}}]}).toArray((err,result)=>{
            if(err){
                return cb({
                    status:false,
                    msg:errorConstants.getTransaction
                })
            }
            else{
              return cb({
                  status:true,
                  msg:'',
                  data:result
              })
            }
        })
            
    });
        
  } catch (error) {
    console.log(error);
  }
}
module.exports={
  getList,
  createTransaction,
  getTransaction
}