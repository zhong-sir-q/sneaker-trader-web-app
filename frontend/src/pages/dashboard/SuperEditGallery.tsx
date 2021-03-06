import React, { useRef, useState, useEffect } from 'react';

import { Table, Card, CardBody, Button, CardFooter } from 'reactstrap';
import { Dialog, DialogTitle, DialogActions, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Edit } from '@material-ui/icons';

import { useHistory } from 'react-router-dom';

import { v4 as uuidV4 } from 'uuid';

import styled from 'styled-components';

import PanelHeader from 'components/PanelHeader';
import AlertDialog from 'components/AlertDialog';
import SneakerNameCell from 'components/SneakerNameCell';
import SuperUserEditPhotoDialog from 'components/dialog/SuperUserEditPhotoDialog';

import { SneakerController } from 'api/controllers/SneakerController';

import { useAuth } from 'providers/AuthProvider';

import isAdminUser from 'usecases/isAdminUser';

import { ADMIN, DASHBOARD } from 'routes';

import { AwsController } from 'api/controllers/AwsController';

import { Sneaker } from '../../../../shared';

import { createBlob } from 'utils/utils';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import usePagination from 'hooks/usePagination';

const HiddenInput = styled.input`
  display: none;
`;

// TODO: the mainDisplayImage field should be in the db instead
type TableRowProps = {
  sneaker: Sneaker & { mainDisplayImage: string };
  sneakerController: SneakerController;
  awsController: AwsController;
};

const useRowDialogStyle = makeStyles(() => ({
  dialogAction: {
    justifyContent: 'space-evenly',
  },
}));

const TableRow = (props: TableRowProps) => {
  const confirmUploadDialogHook = useOpenCloseComp();
  const confirmCancelEditDialogHook = useOpenCloseComp();
  const successAlertHook = useOpenCloseComp();

  const inputRef = useRef<HTMLInputElement>(null);

  const classes = useRowDialogStyle();

  const { sneaker, sneakerController, awsController } = props;
  const { brand, mainDisplayImage, name, colorway, id } = sneaker;

  const [displayImg, setDisplayImg] = useState(mainDisplayImage);
  const [cropperImage, setCropperImage] = useState(mainDisplayImage);
  const displayName = `${brand} ${name}`;

  const onUpload = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const changeSneakerRemoteImage = async (sneakerId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const s3ImgUrl = await awsController.uploadS3SignleImage(formData);

    sneakerController.updateDisplayImage(sneakerId, s3ImgUrl);
  };

  // create some lag, so the user does not see the change
  // of cropper image upon closing the dialog
  const lagUpdateCropperImage = (newImg: string) => setTimeout(() => setCropperImage(newImg), 200);

  const onConfirmEdit = async (editedImgDataUrl: string) => {
    setDisplayImg(editedImgDataUrl);
    confirmUploadDialogHook.onClose();

    const f = new File([await createBlob(editedImgDataUrl)], uuidV4());
    await changeSneakerRemoteImage(id, f);

    lagUpdateCropperImage(editedImgDataUrl);
  };

  const onImgChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = evt.target;

    if (!files) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = async () => setCropperImage(reader.result as string);

    if (file) reader.readAsDataURL(file);
  };

  const cancleEditing = () => confirmCancelEditDialogHook.onOpen();

  const continuneEdit = () => confirmCancelEditDialogHook.onClose();

  const confrimCancel = () => {
    confirmCancelEditDialogHook.onClose();
    confirmUploadDialogHook.onClose();
    lagUpdateCropperImage(displayImg);
  };

  return (
    <tr>
      <SneakerNameCell imgSrc={displayImg} name={displayName} displaySize='' colorway={colorway} />
      <td>
        <Edit className='pointer' onClick={confirmUploadDialogHook.onOpen} fontSize='default' />
        <SuperUserEditPhotoDialog
          open={confirmUploadDialogHook.open}
          imgSrc={cropperImage}
          onDone={onConfirmEdit}
          onUpload={onUpload}
          onCancel={cancleEditing}
        />
        <AlertDialog
          color='success'
          message='Product image updated'
          open={successAlertHook.open}
          onClose={successAlertHook.onClose}
        />
        <Dialog open={confirmCancelEditDialogHook.open} onClose={confirmCancelEditDialogHook.onClose}>
          <DialogTitle>Cancel Edit?</DialogTitle>
          <DialogActions className={classes.dialogAction}>
            <Button onClick={continuneEdit} color='primary'>
              No
            </Button>
            <Button onClick={confrimCancel}>Yes</Button>
          </DialogActions>
        </Dialog>
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
  const [sneakers, setSneakers] = useState<any[]>([]);

  const { currentPage, pagesCount, startRowCount, endRowCount, PaginationComponent } = usePagination(
    sneakers.length,
    8
  );

  const { sneakerController, awsController } = props;

  useEffect(() => {
    if (!currentUser) return;

    if (!signedIn || !isAdminUser(currentUser.email)) {
      history.push(ADMIN + DASHBOARD);
      return;
    }

    const fetchGallerySneakers = async () => {
      const s = await sneakerController.getGallerySneakers();
      setSneakers(s.map((sneaker) => ({ ...sneaker, mainDisplayImage: sneaker.imageUrls.split(',')[0] })));
    };

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
                  {sneakers.slice(startRowCount(), endRowCount()).map((sneaker, idx) => (
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
            <Footer>
              <PaginationComponent />
              <p>
                {currentPage + 1} of {pagesCount}
              </p>
            </Footer>
          </Card>
        )}
      </div>
    </React.Fragment>
  );
};

const Footer = styled(CardFooter)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default SuperEditGallery;
