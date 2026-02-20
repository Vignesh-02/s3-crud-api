const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;



module.exports.handler = async (event) => {
  try {
    const key = decodeURIComponent(event.pathParameters.fileKey);

    console.log('image key', key)

    const data = await s3
      .getObject({
        Bucket: BUCKET_NAME,
        Key: key,
      })
      .promise();

    console.log('image data', data)


    return {
      statusCode: 200,
      isBase64Encoded: true, // ✅ REQUIRED
      headers: {
        "Content-Type": data.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
      body: data.Body.toString("base64"), // ✅ RAW IMAGE DATA
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "failed to retrieve file from S3",
        errorMessage: err.message,
      }),
    };
  }
};

// module.exports.handler = async(event) => {
//     console.log(event);

//     //for lambda proxy integration we need to mention whether we are doing base64Encoded or not
//     const response = {
//         isBase64Encoded: true,
//         statusCode: 200,
//     };

//     try{
//         const params ={
//             Bucket: BUCKET_NAME,
//             Key: decodeURIComponent(event.pathParameters.fileKey),
//         };
         
//         const data = await s3.getObject(params).promise();

//         const out={
//             statusCode: 200,
//       isBase64Encoded: true, // ✅ REQUIRED
//       headers: {
//         "Content-Type": data.ContentType || "application/octet-stream",
//         "Cache-Control": "public, max-age=3600",
//       },
//       body: data.Body.toString("base64"), // ✅ RAW IMAGE DATA
//       message: "successfully retrieved file from S3"
//         }

//         response.body = out;
//     }catch(err){
//         console.log(err);
//         response.body = JSON.stringify({message: "failed to retrieve file from S3",errorMessage : err})
//         response.statusCode = 500;
//     }
//     return response;
// };

// const AWS = require("aws-sdk");
// const s3 = new AWS.S3();

// const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;