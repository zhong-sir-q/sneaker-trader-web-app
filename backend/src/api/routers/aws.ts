import multer from 'multer';
import { Router } from 'express';
import CustomAwsService, { s3BucketFolder } from '../../services/external/AwsService';

const upload = multer({ dest: 'uploads/' });

const awsRoute = Router();

export default (app: Router, CustomAwsServiceInstance: CustomAwsService) => {
  app.use('/aws', awsRoute);

  awsRoute.post('/upload', upload.single('file'), (req, res, next) => {
    CustomAwsServiceInstance.uploadFileToS3(req.file, s3BucketFolder)
      .then((data) => res.json(data.Location))
      .catch((err) => next(err));
  });

  awsRoute.post('/uploads', upload.array('files', 5), (req, res, next) => {
    const files = req.files as Express.Multer.File[];
    CustomAwsServiceInstance.s3UploadFiles(files)
      .then((imageUrls) => res.json(imageUrls))
      .catch(next);
  });
};
