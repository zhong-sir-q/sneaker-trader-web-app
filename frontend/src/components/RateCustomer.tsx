import React, { useState } from "react";

import { Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import { Input, Button } from "reactstrap";

import { RatingButton } from "./buttons/StyledButton";

type RateCustomerProps = {
  title: string;
  listedProductId: number;
  rateUser: (listedProductId: number, rating: number) => Promise<void>;
};

const RateCustomer = (props: RateCustomerProps) => {
  const [open, setOpen] = React.useState(false);

  const [rating, setRating] = useState<number>(1);

  const onSelectRating = (evt: any) => setRating(evt.target.value);

  const { title, listedProductId, rateUser } = props;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onConfirm = async () => {
    await rateUser(listedProductId, Number(rating));
    handleClose();
  };

  return (
    <div>
      <RatingButton color='primary' onClick={handleClickOpen}>
        {title}
      </RatingButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Input onChange={onSelectRating} type='select'>
            {Array(10)
              .fill(0)
              .map((_, idx) => (
                <option value={idx + 1} key={idx}>
                  {idx + 1}
                </option>
              ))}
          </Input>
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

export default RateCustomer
