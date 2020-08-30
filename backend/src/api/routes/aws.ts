import fs from 'fs';
import aws from 'aws-sdk';
import multer from 'multer';
import { Router } from 'express';

import config from '../../config';

const upload = multer({ dest: 'uploads/' });

const awsRoute = Router();

export default (app: Router) => {
  app.use('/aws', awsRoute);

  awsRoute.post('/upload', upload.single('file'), (req, res, next) => {
    // NOTE: in the future if there are other places where AWS is used, move the configuration to /config
    const s3 = new aws.S3({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });

    const s3BucketFolder = 'sneakers/';

    const params: aws.S3.PutObjectRequest = {
      Bucket: config.imageBucket,
      ACL: 'public-read',
      // An efficient way of uploading the image because I need to access the file system
      Body: fs.createReadStream(req.file.path),
      // should replace this with a uuid name
      Key: s3BucketFolder + req.file.filename,
    };

    s3.upload(params, (err, data) => {
      if (err) next(err);
      else res.json(data);
    });
  });
};
