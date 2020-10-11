import formatApiEndpoint, { concatPaths } from 'api/formatApiEndpoint';

export class AwsController {
  awsPath: string;

  constructor() {
    this.awsPath = formatApiEndpoint('aws');
  }

  uploadS3SignleImage = (formData: FormData): Promise<string> =>
    fetch(concatPaths(this.awsPath, 'upload'), {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());

  uploadS3MultipleImages = (formData: FormData): Promise<string[]> =>
    fetch(concatPaths(this.awsPath, 'uploads'), {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());
}

const AwsControllerInstance = new AwsController();

export default AwsControllerInstance;
