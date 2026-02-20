# S3 CRUD API

A serverless REST API built with AWS Lambda and API Gateway that lets you upload, retrieve, and delete files from an S3 bucket. Deployed using the Serverless Framework.

## Architecture

```
Client → API Gateway (HTTP API) → Lambda Functions → S3 Bucket
```

Each Lambda function has its own scoped IAM role (using `serverless-iam-roles-per-function`), following the principle of least privilege.

## Tech Stack

- **Runtime**: Node.js 20.x
- **Cloud**: AWS (Lambda, S3, API Gateway)
- **Framework**: Serverless Framework
- **Plugin**: `serverless-iam-roles-per-function`
- **SDK**: AWS SDK v2

## Project Structure

```
s3-crud-api/
├── src/
│   ├── upload.js   # POST /file — uploads a base64-encoded image to S3
│   ├── get.js      # GET  /file/{fileKey} — retrieves a file from S3
│   └── delete.js   # DELETE /file/{fileKey} — deletes a file from S3
├── serverless.yml  # Infrastructure and function definitions
└── package.json
```

## API Endpoints

### Upload a File
`POST /file`

Accepts a base64-encoded image and uploads it to the S3 bucket.

**Request Body:**
```json
{
  "file": "data:image/jpeg;base64,/9j/4AAQSkZJRgAB...",
  "fileKey": "my-image.jpg"
}
```

**Response:**
```json
{
  "message": "Successfully uploaded file to S3",
  "uploadResult": { ... }
}
```

---

### Get a File
`GET /file/{fileKey}`

Retrieves a file from S3 by its key. Returns the raw binary image data as a base64-encoded response body, which API Gateway decodes before sending to the client.

**Example:** `GET /file/my-image.jpg`

**Response:** Binary image data with appropriate `Content-Type` header.

---

### Delete a File
`DELETE /file/{fileKey}`

Deletes a file from S3 by its key.

**Example:** `DELETE /file/my-image.jpg`

**Response:**
```json
{
  "message": "successfully deleted file from S3"
}
```

## Setup & Deployment

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [Serverless Framework](https://www.serverless.com/) installed globally
- AWS CLI configured with valid credentials

### Install Dependencies

```bash
npm install
```

### Deploy to AWS

```bash
serverless deploy
```

This will provision:
- An S3 bucket named `viguito-s3-crud-api-vigu-dev`
- Three Lambda functions with scoped IAM roles
- An HTTP API Gateway with CORS enabled

### Remove Stack

```bash
serverless remove
```

## Environment Variables

| Variable | Description |
|---|---|
| `FILE_UPLOAD_BUCKET_NAME` | Name of the S3 bucket — set automatically by Serverless from `serverless.yml` |

## IAM Permissions

Each function is granted only the permissions it needs:

| Function | S3 Permission |
|---|---|
| `s3FileUploader` | `s3:PutObject` |
| `s3FileGet` | `s3:GetObject`, `s3:ListBucket` |
| `s3FileDelete` | `s3:DeleteObject` |
