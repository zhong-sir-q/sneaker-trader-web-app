import React, { useState } from 'react';
import {
  ListGroup,
  ListGroupItem,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from 'reactstrap';

import LazyLoad from 'react-lazyload';

import styled from 'styled-components';

import SneakerCard from 'components/SneakerCard';
import CenterSpinner from 'components/CenterSpinner';
import SneakerCarousel from 'components/SneakerCarousel';

import { ListedSneakerSeller, Sneaker } from '../../../shared';
import { getMainDisplayImgUrl } from 'utils/utils';

import defaultAvatar from 'assets/img/placeholder.jpg';
import { TOTAL_USER_RATING } from 'const/variables';

const SellerListGroupItem = styled(ListGroupItem)`
  outline: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  max-width: 5.3125rem;

  @media (max-width: 768px) {
    max-width: 4.0625rem;
  }
`;

type SortByPriceDropdownProps = {
  sortInDescendingOrder: () => void;
  sortInAscendingOrder: () => void;
};

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

const getSellerSeneakrImgUrls = (imageUrls: string) => imageUrls.split(',');

type ViewSellersListProps = {
  sellers: ListedSneakerSeller[] | undefined;
  selectedSellerIdx: number;
  displaySneaker: Sneaker | undefined;
  processingPurchase: boolean;
  sortSellersByAskingPriceAscending: () => void;
  sortSellersByAskingPriceDescending: () => void;
  onCancel: () => void;
  onSelectSeller: (sellerIdx: number) => void;
  onConfirm: () => void;
};

const StyledListGroup = styled(ListGroup)`
  max-height: 500px;
  overflow: auto;
`;

const Wrapper = styled.div`
  padding: 0 15%;
  min-height: calc(95vh - 75px);
`;

const FlexWrapper = styled(Wrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const BigSpinner = styled(Spinner)`
  width: 4rem;
  height: 4rem;
`;

const HelperText = styled.p`
  font-size: 1.75rem;
  margin-top: 0.5rem;

  @media (max-width: 1264px) {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ViewSellersList = (props: ViewSellersListProps) => {
  const {
    sellers,
    selectedSellerIdx,
    displaySneaker,
    sortSellersByAskingPriceAscending,
    sortSellersByAskingPriceDescending,
    onCancel,
    onConfirm,
    processingPurchase,
    onSelectSeller,
  } = props;

  if (processingPurchase)
    return (
      <FlexWrapper>
        <BigSpinner />
        <HelperText>We are processing your request</HelperText>
      </FlexWrapper>
    );

  return !sellers || !displaySneaker ? (
    <Wrapper>
      <CenterSpinner fullScreenHeight />
    </Wrapper>
  ) : (
    <React.Fragment>
      <Wrapper>
        {selectedSellerIdx === -1 ? (
          <SneakerCard
            styles={{ margin: 'auto', marginBottom: '15px' }}
            sneaker={displaySneaker}
            mainDisplayImage={getMainDisplayImgUrl(displaySneaker.imageUrls)}
            price={undefined}
            maxWidth='400px'
          />
        ) : (
          <SneakerCarousel imgUrlItems={getSellerSeneakrImgUrls(sellers[selectedSellerIdx].sneakerImgUrls)} />
        )}
        <SortByPriceDropdown
          sortInAscendingOrder={sortSellersByAskingPriceAscending}
          sortInDescendingOrder={sortSellersByAskingPriceDescending}
        />
        <StyledListGroup>
          {sellers.map(({ username, profilePicUrl, askingPrice, rating }, idx) => (
            <SellerListGroupItem
              key={idx}
              action
              onClick={() => onSelectSeller(idx)}
              style={{
                borderColor: idx === selectedSellerIdx ? 'green' : undefined,
                borderTopWidth: '1px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                  <span className='bold'>Username:</span>
                  <span> {username}</span>
                </div>
                <div>
                  <span className='bold'>Asking price:</span>
                  <span> $ {askingPrice}</span>
                </div>
                <div>
                  <span className='bold'>Rating:</span>
                  <span>
                    {' '}
                    {!rating || rating <= 0 ? 0 : rating} out of {TOTAL_USER_RATING}
                  </span>
                </div>
              </div>
              <LazyLoad>
                <ProfileImg src={profilePicUrl || defaultAvatar} alt={`${username} profile`} />
              </LazyLoad>
            </SellerListGroupItem>
          ))}
        </StyledListGroup>
        <footer>
          {selectedSellerIdx !== -1 && selectedSellerIdx < sellers.length ? (
            <ListGroup style={{ marginTop: '1rem' }}>
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
              <Button style={{ marginRight: '1.5625rem' }} onClick={onCancel}>
                Cancel
              </Button>
              <Button disabled={selectedSellerIdx === -1 || processingPurchase} color='primary' onClick={onConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        </footer>
      </Wrapper>
    </React.Fragment>
  );
};

export default ViewSellersList;
