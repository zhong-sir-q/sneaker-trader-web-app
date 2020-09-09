import fs from 'fs';
import aws from 'aws-sdk';
import multer from 'multer';
import { Router } from 'express';

import config from '../../config';

const upload = multer({ dest: 'uploads/' });

const awsRoute = Router();

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3BucketFolder = 'sneakers/';

const uploadFileToS3 = (file: Express.Multer.File, s3Folder: string) => {
  const params: aws.S3.PutObjectRequest = {
    Bucket: config.imageBucket,
    ACL: 'public-read',
    // An inefficient way of uploading the image
    // because I need to access the file system
    Body: fs.createReadStream(file.path),
    // should replace this with a uuid name
    Key: s3Folder + file.filename,
  };

  return s3.upload(params).promise();
};

export default (app: Router) => {
  app.use('/aws', awsRoute);

  // TODO: change both multer and S3 so it can accept and upload multiple files at a time
  awsRoute.post('/upload', upload.single('file'), (req, res, next) => {
    uploadFileToS3(req.file, s3BucketFolder)
      .then((_) => res.send('File uploaded'))
      .catch((err) => next(err));
  });

  awsRoute.post('/uploads', upload.array('files', 5), (req, res, next) => {
    const files = req.files as Express.Multer.File[];
    const s3Promises = files.map((file) => uploadFileToS3(file, s3BucketFolder).then(data => data.Location));

    Promise.all(s3Promises)
      .then((imageUrls) => res.json(imageUrls))
      .catch((err) => next(err));
  });
};
