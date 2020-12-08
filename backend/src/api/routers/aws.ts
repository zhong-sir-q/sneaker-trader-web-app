import multer from 'multer';
import { Router } from 'express';
import CustomAwsService, { s3BucketFolder } from '../../services/external/AwsService';
import { ExpressHandler } from '../../@types/express';

const upload = multer({ dest: 'uploads/' });

const awsRoute = Router();

const createAwsHandlers = (customAwsService: CustomAwsService) => {
  const getS3SneakerImageObject: ExpressHandler = (req, res, next) => {
    const { key } = req.params;
    customAwsService.getS3SneakerImageObject(key).then((r) => {
      res.setHeader('content-type', 'application/octet-stream');
      res.send(r);
    }).catch(next);
  };

  return { getS3SneakerImageObject };
};

export default (app: Router, customAwsService: CustomAwsService) => {
  const { getS3SneakerImageObject } = createAwsHandlers(customAwsService);

  app.use('/aws', awsRoute);

  awsRoute.route('/image/:key').get(getS3SneakerImageObject);

  awsRoute.post('/upload', upload.single('file'), (req, res, next) => {
    customAwsService
      .uploadFileToS3(req.file, s3BucketFolder)
      .then((locationUrl) => res.json(locationUrl))
      .catch((err) => next(err));
  });

  awsRoute.post('/uploads', upload.array('files', 5), (req, res, next) => {
    const files = req.files as Express.Multer.File[];
    customAwsService
      .s3UploadFiles(files)
      .then((imageUrls) => res.json(imageUrls))
      .catch(next);
  });
};
