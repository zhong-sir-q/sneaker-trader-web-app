import fs from 'fs';
import aws from 'aws-sdk';
import config from '../../config';

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

export const s3BucketFolder = 'sneakers/';

class CustomAwsService {
  uploadFileToS3 = async (file: Express.Multer.File, s3Folder: string): Promise<string> => {
    const params: aws.S3.PutObjectRequest = {
      Bucket: config.imageBucket,
      ACL: 'public-read',
      // An inefficient way of uploading the image
      // because I need to access the file system
      Body: fs.createReadStream(file.path),
      Key: s3Folder + file.filename,
    };

    return s3.upload(params).promise().then(r => r.Location);
  };

  s3UploadFiles = (files: Express.Multer.File[]): Promise<string[]> => {
    const s3Promises = files.map((file) => this.uploadFileToS3(file, s3BucketFolder).then((url) => url));

    return Promise.all(s3Promises);
  };
}

export default CustomAwsService;
