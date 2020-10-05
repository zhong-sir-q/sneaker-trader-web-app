import React, { useState } from 'react';

import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import { ListGroup, ListGroupItem, ListGroupItemText, InputGroup } from 'reactstrap';

import OutsideClickHandler from './OutsideClickHandler';

export const mockSneakerSearchOptions = [
  {
    id: 8,
    name: 'Stephen Curry 4',
    brand: 'Under Armor',
    size: 12,
    colorway: 'White and black',
    RRP: 225,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/c40940c03e7f3be51b6dbe1a7557f338',
  },
  {
    id: 9,
    name: 'kd 9 elite',
    brand: 'Nike',
    size: 8,
    colorway: 'Black',
    RRP: 345,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/d543bf97f60483f82824ba6691478e9f',
  },
  {
    id: 11,
    name: 'AJ 1 Retro',
    brand: 'Air Jordan',
    size: 1,
    colorway: 'Red and White',
    RRP: 400,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/72361fa2804ee8416d7d3a771cd0e3f3',
  },
  {
    id: 13,
    name: 'Kobe 14',
    brand: 'Nike',
    size: 12,
    colorway: 'Black',
    RRP: 600,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083',
  },
  {
    id: 14,
    name: 'Kobe 14',
    brand: 'Nike',
    size: 10,
    colorway: 'Black',
    RRP: 400,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083',
  },
  {
    id: 15,
    name: 'Jordan 1',
    brand: 'Nike',
    size: 9,
    colorway: 'Bred',
    RRP: 800,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/79ee5ea2a9d6e1591c95a985a1b0c55f',
  },
  {
    id: 16,
    name: 'Air Max 270',
    brand: 'Nike',
    size: 10,
    colorway: 'White',
    RRP: 270,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/30bf7e22ef82729b002188ae0a7bd493',
  },
  {
    id: 17,
    name: 'Lebron James 17',
    brand: 'Nike',
    size: 12,
    colorway: 'Black and white',
    RRP: 0,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/fd2e447635a9d7943b2fd8421ded2dce',
  },
  {
    id: 19,
    name: 'Formposite',
    brand: 'Nike',
    size: 11,
    colorway: 'Black',
    RRP: 0,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/1a6840770a33221efa85b9c04fa3ba4b,https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/79dd2a32f45a05e233843fb97402cdf1,https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/a202d4363b2f45bd864af86c52ed22bb',
  },
  {
    id: 20,
    name: 'Kyrie 4 BHM',
    brand: 'Nike',
    size: 10,
    colorway: 'White',
    RRP: 0,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/df11ee1f25e9f220ca35f2cc7ff2d659',
  },
  {
    id: 21,
    name: 'Mamba Fury',
    brand: 'Nike',
    size: 9,
    colorway: 'Lakers',
    RRP: 0,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/296eed956308140bc554a8efaa0880cc,https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/3128ba5a96c2789151fb5475f17ebd47,https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/0ed5ac0e71af21206e93b847bff5f173,https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/79790d7fedc9e78b3d03bbc45124e1a3,https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/665858c428d9b169962370408f00fe24',
  },
  {
    id: 22,
    name: 'Mamba Fury',
    brand: 'Nike',
    size: 9,
    colorway: 'White Field Purple',
    RRP: 0,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/a07aafbea88d12add10fd3f580b34298,https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/2a1416951ded378c7ae60b6993f4066f,https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/ca2a069aeb5e67a355b41055fef3ea04,https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/1ff84efd3408f3a247b83f64dfbe2027,https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/5ccfe194040776b2179197f7b0af56e9',
  },
  {
    id: 26,
    name: 'Kawahi 1',
    brand: 'New Balance',
    size: 12,
    colorway: 'Black and white',
    RRP: 0,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/039f22dc43cd297f5a6730807993d3b0',
  },
  {
    id: 30,
    name: 'James Harden Vol 3',
    brand: 'Adidas',
    size: 12,
    colorway: 'Red',
    RRP: 0,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/7eff8df574becedda59d465949d3a1dc',
  },
];

const ListItemImg = styled.img`
  width: 100px;
  margin-right: 10px;

  @media (min-width: 768px) {
    width: 125px;
    margin-right: 20px;
  }
`;

const SneakerSearchBar = (props: { items: any[] }) => {
  const [searchVal, setSearchVal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(0);

  const formatName = (sneaker: any) => [sneaker.brand, sneaker.name, sneaker.colorway].join(' ');

  const hideSuggestions = () => setShowSuggestions(false);
  const openSuggestions = () => setShowSuggestions(true);

  const result = !searchVal
    ? props.items
    : props.items.filter((sneaker) => formatName(sneaker).toLowerCase().indexOf(searchVal.toLowerCase()) > -1);

  const onChange = (evt: any) => {
    const { value } = evt.target;

    if (value === '') hideSuggestions();
    else openSuggestions();

    setSearchVal(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveSuggestionIdx(0);
      setShowSuggestions(false);
      if (activeSuggestionIdx < props.items.length) setSearchVal(props.items[activeSuggestionIdx]);
    } else if (e.key === 'ArrowUp') {
      if (activeSuggestionIdx === 0) return;
      setActiveSuggestionIdx(activeSuggestionIdx - 1);
    } else if (e.key === 'ArrowDown') {
      if (activeSuggestionIdx === props.items.length - 1) return;
      setActiveSuggestionIdx(activeSuggestionIdx + 1);
    } else if (e.key === 'Tab') hideSuggestions();
  };

  return (
    <div style={{ position: 'relative' }}>
      <InputGroup>
        <div
          style={{
            position: 'absolute',
            padding: '2px',
            paddingLeft: '8px',
          }}
        >
          <SearchIcon />
        </div>
        <input
          placeholder='Search...'
          style={{ width: '500px', paddingLeft: '35px' }}
          value={searchVal}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </InputGroup>
      {showSuggestions && (
        <OutsideClickHandler handler={hideSuggestions}>
          <ListGroup
            style={{
              position: 'absolute',
              marginTop: '5px',
              zIndex: 1,
              width: '100%',
              overflow: 'auto',
              maxHeight: '500px',
            }}
          >
            {result.map((item, idx) => (
              <ListGroupItem style={{ padding: '0 0 10px 0' }} key={idx}>
                <div>
                  <ListItemImg src={item.imageUrls.split(',')[0]} />
                  <ListGroupItemText>{formatName(item)}</ListGroupItemText>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default SneakerSearchBar;
