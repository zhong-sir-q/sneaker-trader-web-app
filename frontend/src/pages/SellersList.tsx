import React, { useState, useEffect } from 'react';
import {
  ListGroup,
  ListGroupItem,
  Container,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CarouselItem,
  Carousel,
  CarouselControl,
} from 'reactstrap';

import { useHistory } from 'react-router-dom';

import _ from 'lodash';

import SneakerCard from 'components/SneakerCard';
import CenterSpinner from 'components/CenterSpinner';

import { useAuth } from 'providers/AuthProvider';

import { getSellersBySneakerNameSize, getProductByNameColorwaySize } from 'api/api';

import { SIGNIN, AUTH } from 'routes';
import { MailAfterPurchasePayload, Sneaker, CreateTransactionPayload, ListedSneakerSeller } from '../../../shared';

import getTransactionFees from 'usecases/getTransactionFee';
import onConfirmPurchaseSneaker from 'usecases/onConfirmPurchaseSneaker';

type SortByPriceDropdownProps = {
  sortInDescendingOrder: () => void;
  sortInAscendingOrder: () => void;
};

// TODO: disable the sort option once an order has been selected
const SortByPriceDropdown = (props: SortByPriceDropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { sortInAscendingOrder, sortInDescendingOrder } = props;

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle color='primary' caret>
          Sort by
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={sortInDescendingOrder}>Price: Hight-Low</DropdownItem>
          <DropdownItem onClick={sortInAscendingOrder}>Price: Low-High</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

type SneakerCarouselProps = {
  imgUrlItems: string[];
};

const SneakerCarousel = (props: SneakerCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const { imgUrlItems } = props;

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === imgUrlItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? imgUrlItems.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const slides = imgUrlItems.map((url, idx) => {
    return (
      <CarouselItem onExiting={() => setAnimating(true)} onExited={() => setAnimating(false)} key={idx}>
        <img style={{ width: '100%' }} src={url} alt={url} />
      </CarouselItem>
    );
  });

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous}>
      {slides}
      <CarouselControl direction='prev' directionText='Previous' onClickHandler={previous} />
      <CarouselControl direction='next' directionText='Next' onClickHandler={next} />
    </Carousel>
  );
};

const SellersList = () => {
  const [sellers, setSellers] = useState<ListedSneakerSeller[]>([]);
  const [selectedSellerIdx, setSelectedSellerIdx] = useState<number>(-1);
  const [sneaker, setSneaker] = useState<Sneaker>();

  const history = useHistory();

  const { signedIn, currentUser } = useAuth();

  const sneakerInfo = history.location.pathname.split('/');
  const sneakerNameColorway = sneakerInfo[1].split('-').join(' ');
  const sneakerSize = Number(sneakerInfo[sneakerInfo.length - 1]);

  const formatProductName = () => `Size ${sneakerSize} ${sneakerNameColorway}`;

  const onComponentLoaded = async () => {
    if (!signedIn) {
      history.push(AUTH + SIGNIN, history.location.pathname);
      return;
    }

    const sneakerToBuy = await getProductByNameColorwaySize(sneakerNameColorway, sneakerSize);
    const sellersBySneakerNameSize = await getSellersBySneakerNameSize(sneakerNameColorway, sneakerSize);

    setSneaker(sneakerToBuy);
    setSellers(sellersBySneakerNameSize);
  };

  useEffect(() => {
    if (sellers.length === 0) onComponentLoaded();
  });

  const formatMailPayload = (sellerIdx: number): MailAfterPurchasePayload => {
    const { username, email } = currentUser!;

    const mailPayload: MailAfterPurchasePayload = {
      sellerUserName: sellers[sellerIdx].username,
      sellerEmail: sellers[sellerIdx].email,
      buyerUserName: username,
      buyerEmail: email,
      productName: formatProductName(),
    };

    return mailPayload;
  };

  const onEmailSent = () => {
    alert('The seller will be in touch with you shortly');
    history.push('/');
  };

  const onConfirm = async () => {
    const sellerId = sellers[selectedSellerIdx].id;
    const { askingPrice, listedProductId } = sellers[selectedSellerIdx];

    const processingFee = getTransactionFees(askingPrice);
    const mailPayload = formatMailPayload(selectedSellerIdx);

    try {
      const transaction: CreateTransactionPayload = {
        buyerId: currentUser!.id!,
        sellerId,
        amount: askingPrice,
        processingFee,
        listedProductId,
      };

      const decreaseWalletBalPayload = { userId: sellerId, amount: processingFee };

      await onConfirmPurchaseSneaker(
        mailPayload,
        transaction,
        listedProductId,
        sellerId,
        decreaseWalletBalPayload,
        onEmailSent
      );
    } catch {}
  };

  const sortSellersByAskingPriceAscending = () => {
    const ascSellers = _.orderBy(sellers, ['askingPrice'], ['asc']);
    setSellers(ascSellers);
  };

  const sortSellersByAskingPriceDescending = () => {
    const descSellers = _.orderBy(sellers, ['askingPrice'], ['desc']);
    setSellers(descSellers);
  };

  const onCancel = () => history.goBack();

  const getSellerSeneakrImgUrls = () => sellers[selectedSellerIdx].imageUrls.split(',');

  return sellers.length === 0 || !currentUser || !sneaker ? (
    <CenterSpinner />
  ) : (
    <Container style={{ minHeight: 'calc(95vh - 96px)' }} fluid='md'>
      {selectedSellerIdx === -1 ? (
        <SneakerCard
          styles={{ margin: 'auto', marginBottom: '15px' }}
          sneaker={sneaker}
          price={undefined}
          maxWidth='400px'
        />
      ) : (
        <SneakerCarousel imgUrlItems={getSellerSeneakrImgUrls()} />
      )}
      <SortByPriceDropdown
        sortInAscendingOrder={sortSellersByAskingPriceAscending}
        sortInDescendingOrder={sortSellersByAskingPriceDescending}
      />
      <ListGroup>
        {sellers.map(({ id, username, askingPrice, rating }, idx) => {
          // the customer cannot buy their own listing
          if (id === currentUser!.id) return undefined;

          return (
            <ListGroupItem
              tag='button'
              key={idx}
              action
              onClick={() => setSelectedSellerIdx(idx)}
              style={{
                borderColor: idx === selectedSellerIdx ? 'green' : undefined,
                outline: 'none',
                borderTopWidth: '1px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>User Name: {username}</span>
                <span>Asking Price: ${askingPrice}</span>
                <span>Rating: {!rating || rating <= 0 ? 0 : rating}</span>
              </div>
            </ListGroupItem>
          );
        })}
      </ListGroup>
      <footer>
        {selectedSellerIdx !== -1 && selectedSellerIdx < sellers.length ? (
          <ListGroup style={{ marginTop: '15px' }}>
            <ListGroupItem>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Transaction fees:</span>
                <span>${getTransactionFees(sellers[selectedSellerIdx].askingPrice)}</span>
              </div>
            </ListGroupItem>
            <ListGroupItem>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total:</span>
                <span>${sellers[selectedSellerIdx].askingPrice}</span>
              </div>
            </ListGroupItem>
          </ListGroup>
        ) : null}
        <div className='text-center'>
          <div>
            {/* NOTE: Not sure why accessing the sneaker route via the name colorway
            force redirect me back to the gallery page  */}
            <Button style={{ marginRight: '25px' }} onClick={onCancel}>
              Cancel
            </Button>
            <Button disabled={selectedSellerIdx === -1} color='primary' onClick={() => onConfirm()}>
              Confirm
            </Button>
          </div>
          <p className='category' style={{ margin: 0, fontSize: '0.95em' }}>
            We will contact the seller on your behalf to get in touch
          </p>
        </div>
      </footer>
    </Container>
  );
};

export default SellersList;
