import React, { useState } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Slider, Grid } from '@material-ui/core';
import { Button, Input } from 'reactstrap';

import { RatingButton } from './buttons/StyledButton';

type RateCustomerProps = {
  title: string;
  listedProductId: number;
  rateUser: (listedProductId: number, rating: number, comment: string) => Promise<any>;
};

const ratingMarks = Array(10)
  .fill(0)
  .map((_, idx) => ({ value: idx + 1, label: String(idx + 1) }));

const RateCustomer = (props: RateCustomerProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const { title, listedProductId, rateUser } = props;

  const onInputChange = (evt: any) => setComment(evt.target.value);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onConfirm = async () => {
    await rateUser(listedProductId, rating, comment);
    handleClose();
  };

  return (
    <div>
      <RatingButton color='primary' onClick={handleClickOpen}>
        {title}
      </RatingButton>
      <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item>Poor</Grid>
            <Grid item xs>
              <Slider
                value={rating}
                onChange={(_, newVal) => setRating(newVal as number)}
                step={1}
                marks={ratingMarks}
                min={1}
                max={10}
              />
            </Grid>
            <Grid item>
              <div>Excellence</div>
            </Grid>
          </Grid>
          <Input
            value={comment}
            onChange={onInputChange}
            style={{ fontSize: '1.35em' }}
            type='textarea'
            placeholder='Any comment? (Optional)'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onConfirm} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RateCustomer;
