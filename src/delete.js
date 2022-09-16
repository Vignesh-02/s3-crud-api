const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async(event) => {
    console.log(event);

    //for lambda proxy integration we need to mention whether we are doing base64Encoded or not
    const response = {
        isBase64Encoded: false,
        statusCode: 200,
    };

    try{
        const params ={
            Bucket: BUCKET_NAME,
            Key: decodeURIComponent(event.pathParameters.fileKey),
        };
         
        const deleteFile = await s3.deleteObject(params).promise();

        response.body = JSON.stringify({message: "successfully deleted file from S3",deleteFile})
    }catch(err){
        console.log(err);
        response.body = JSON.stringify({message: "failed to delete file from S3",errorMessage : err})
        response.statusCode = 500;
    }
    return response;
};