import React, { useState, useEffect, useCallback } from 'react';
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

import { SIGNIN, AUTH, HOME } from 'routes';
import { Sneaker, CreateTransactionPayload, ListedSneakerSeller } from '../../../shared';

import getTransactionFees from 'usecases/getTransactionFee';
import onConfirmPurchaseSneaker from 'usecases/onConfirmPurchaseSneaker';
import SneakerControllerInstance from 'api/controllers/SneakerController';
import SellerControllerInstance from 'api/controllers/SellerController';
import useRedirect from 'hooks/useRedirect';

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

const ViewSellersList = () => {
  const [sellers, setSellers] = useState<ListedSneakerSeller[]>();
  const [selectedSellerIdx, setSelectedSellerIdx] = useState<number>(-1);
  const [sneaker, setSneaker] = useState<Sneaker>();

  const history = useHistory();
  const redirectHome = useRedirect(HOME);

  const { signedIn, currentUser } = useAuth();

  const sneakerInfo = history.location.pathname.split('/');
  const sneakerNameColorway = sneakerInfo[2].split('-').join(' ');
  const sneakerSize = Number(sneakerInfo[sneakerInfo.length - 1]);

  const formatSneakerName = () => `Size ${sneakerSize} ${sneakerNameColorway}`;

  const onComponentLoaded = useCallback(async () => {
    if (!signedIn) {
      history.push(AUTH + SIGNIN, history.location.pathname);
      return;
    }

    const sneakerToBuy = await SneakerControllerInstance.getByNameColorwaySize(sneakerNameColorway, sneakerSize);

    if (sneakerToBuy) setSneaker(sneakerToBuy);

    if (currentUser) {
      const sellersBySneakerNameSize = await SellerControllerInstance.getSellersBySneakerNameSize(
        currentUser.id,
        sneakerNameColorway,
        sneakerSize
      );

      setSellers(sellersBySneakerNameSize);
    }
  }, [history, currentUser, signedIn, sneakerNameColorway, sneakerSize]);

  useEffect(() => {
    onComponentLoaded();
  }, [onComponentLoaded]);

  useEffect(() => {
    // all listed sneakers are from the current user, hence redirect the user back home
    if (sellers && sellers.length === 0) history.push(HOME);
  }, [sellers, history]);

  const onEmailSent = () => {
    alert('The seller will be in touch with you shortly');
    redirectHome();
    window.location.reload();
  };

  const onConfirm = async () => {
    if (!sellers) return;

    const sellerId = sellers[selectedSellerIdx].id;
    const { askingPrice, listedProductId, email, username } = sellers[selectedSellerIdx];

    const processingFee = getTransactionFees(askingPrice);

    const transaction: CreateTransactionPayload = {
      buyerId: currentUser!.id!,
      sellerId,
      amount: askingPrice,
      processingFee,
      listedProductId,
    };

    const decreaseWalletBalPayload = { userId: sellerId, amount: processingFee };

    await onConfirmPurchaseSneaker(
      {
        sellerEmail: email,
        sellerUserName: username,
        buyerUserName: currentUser!.username,
        buyerEmail: currentUser!.email,
        productName: formatSneakerName(),
      },
      transaction,
      listedProductId,
      sellerId,
      decreaseWalletBalPayload
    );

    onEmailSent();
  };

  const sortSellersByAskingPriceAscending = () => {
    if (!sellers) return;

    const ascSellers = _.orderBy(sellers, ['askingPrice'], ['asc']);

    if (selectedSellerIdx > -1) {
      const sellerListedSneakerIdBeforeSort = sellers[selectedSellerIdx].listedProductId;
      const sellerIdxAfterSort = ascSellers.findIndex(
        (seller) => seller.listedProductId === sellerListedSneakerIdBeforeSort
      );
      setSelectedSellerIdx(sellerIdxAfterSort);
    }

    setSellers(ascSellers);
  };

  const sortSellersByAskingPriceDescending = () => {
    if (!sellers) return;

    const descSellers = _.orderBy(sellers, ['askingPrice'], ['desc']);

    if (selectedSellerIdx > -1) {
      const sellerListedSneakerIdBeforeSort = sellers[selectedSellerIdx].listedProductId;
      const sellerIdxAfterSort = descSellers.findIndex(
        (seller) => seller.listedProductId === sellerListedSneakerIdBeforeSort
      );
      setSelectedSellerIdx(sellerIdxAfterSort);
    }

    setSellers(descSellers);
  };

  const onCancel = () => history.goBack();

  const getSellerSeneakrImgUrls = (imageUrls: string) => imageUrls.split(',');

  return !sellers || !currentUser || !sneaker ? (
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
        <SneakerCarousel imgUrlItems={getSellerSeneakrImgUrls(sellers[selectedSellerIdx].imageUrls)} />
      )}
      <SortByPriceDropdown
        sortInAscendingOrder={sortSellersByAskingPriceAscending}
        sortInDescendingOrder={sortSellersByAskingPriceDescending}
      />
      <ListGroup>
        {sellers.map(({ username, askingPrice, rating }, idx) => (
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
        ))}
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

export default ViewSellersList;
