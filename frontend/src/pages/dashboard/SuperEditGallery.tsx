import React, { useRef, useState, useEffect } from 'react';
import PanelHeader from 'components/PanelHeader';

import { Table, Card, CardBody, Button } from 'reactstrap';
import SneakerNameCell from 'components/SneakerNameCell';

// mock data
import { Edit } from '@material-ui/icons';
import useOpenCloseComp from 'hooks/useOpenCloseComp';
import styled from 'styled-components';
import { SneakerController } from 'api/controllers/SneakerController';
import { useAuth } from 'providers/AuthProvider';
import isAdminUser from 'usecases/isAdminUser';
import { useHistory } from 'react-router-dom';
import { ADMIN, DASHBOARD } from 'routes';
import { Skeleton } from '@material-ui/lab';
import { AwsController } from 'api/controllers/AwsController';
import { Sneaker } from '../../../../shared';
import { Dialog, DialogTitle, DialogActions, DialogContent, makeStyles } from '@material-ui/core';
import AlertDialog from 'components/AlertDialog';
import ImgCropper from 'components/ImgCropper';

const HiddenInput = styled.input`
  display: none;
`;

// TODO: the mainDisplayImage field should be in the db instead
type TableRowProps = {
  sneaker: Sneaker & { mainDisplayImage: string };
  sneakerController: SneakerController;
  awsController: AwsController;
};

const useRowDialogStyle = makeStyles((_theme) => ({
  dialogAction: {
    justifyContent: 'center',
  },
}));

const TableRow = (props: TableRowProps) => {
  const confirmUploadDialogHook = useOpenCloseComp();
  const successAlertHook = useOpenCloseComp();
  const inputRef = useRef<HTMLInputElement>(null);

  const styles = useRowDialogStyle();

  const { sneaker, sneakerController, awsController } = props;
  const { brand, mainDisplayImage, name, colorway, id } = sneaker;

  const [displayImg, setDisplayImg] = useState(mainDisplayImage);
  const displayName = `${brand} ${name}`;

  const onUpload = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const onImgChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = evt.target;

    if (!files) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const formData = new FormData();
      formData.append('file', file);
      const s3ImgUrl = await awsController.uploadS3SignleImage(formData);

      sneakerController.updateDisplayImage(id, s3ImgUrl);

      setDisplayImg(reader.result as string);
      confirmUploadDialogHook.onClose();
    };

    if (file) reader.readAsDataURL(file);
  };

  return (
    <tr>
      <SneakerNameCell imgSrc={displayImg} name={displayName} displaySize='' colorway={colorway} />
      <td>
        <Edit className='pointer' onClick={confirmUploadDialogHook.onOpen} fontSize='default' />
        <Dialog open={confirmUploadDialogHook.open} onClose={confirmUploadDialogHook.onClose}>
          <DialogTitle>New Image</DialogTitle>
          <DialogContent>
            <ImgCropper img={displayImg} />
          </DialogContent>
          <DialogActions className={styles.dialogAction}>
            <Button style={{ marginRight: '15px' }} color='primary' onClick={onUpload}>
              Upload
            </Button>
            <Button onClick={confirmUploadDialogHook.onClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <AlertDialog
          color='success'
          message='Product image updated'
          open={successAlertHook.open}
          onClose={successAlertHook.onClose}
        />
        <HiddenInput onChange={onImgChange} type='file' accept='image/*' ref={inputRef} />
      </td>
    </tr>
  );
};

type SuperEditGalleryProps = {
  sneakerController: SneakerController;
  awsController: AwsController;
};

/**
 * A page for admin to edit the sneaker images in the market place page
 */
const SuperEditGallery = (props: SuperEditGalleryProps) => {
  const history = useHistory();
  const { currentUser, signedIn } = useAuth();
  const [sneakers, setSneakers] = useState<any[]>();

  const { sneakerController, awsController } = props;

  const fetchGallerySneakers = async () => {
    const s = await sneakerController.getGallerySneakers();
    setSneakers(s.map((sneaker) => ({ ...sneaker, mainDisplayImage: sneaker.imageUrls.split(',')[0] })));
  };

  useEffect(() => {
    if (!currentUser) return;

    if (!signedIn || !isAdminUser(currentUser.email)) {
      history.push(ADMIN + DASHBOARD);
      return;
    }

    fetchGallerySneakers();
  });

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        {sneakers === undefined ? (
          <Skeleton width='100%' height='85vh' />
        ) : (
          <Card>
            <CardBody>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {sneakers.map((sneaker, idx) => (
                    <TableRow
                      sneaker={sneaker}
                      sneakerController={sneakerController}
                      awsController={awsController}
                      key={idx}
                    />
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        )}
      </div>
    </React.Fragment>
  );
};

export default SuperEditGallery;
