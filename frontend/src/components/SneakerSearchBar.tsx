import React, { useState } from 'react';

import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import { ListGroup, ListGroupItem, ListGroupItemText, InputGroup } from 'reactstrap';

import OutsideClickHandler from './OutsideClickHandler';
import { SearchBarSneaker } from '../../../shared';

const ListItemImg = styled.img`
  height: 125px;
  width: 125px;
  margin-right: 10px;

  @media (min-width: 768px) {
    height: 130px;
    width: 150px;
    margin-right: 20px;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding-left: 35px;

  /* apply margin to the input before collapse */
  @media (min-width: 991px) {
    margin-right: 15px;
  }
`;

const StyledListGroup = styled(ListGroup)`
  position: absolute;
  margin-top: 5px;
  z-index: 1;
  width: 100%;
  overflow: auto;
  max-height: 500px;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  padding: 2px;
  padding-left: 8px;
`;

const StyledListGroupItem = styled(ListGroupItem)`
  display: flex;
  align-items: center;
  padding: 8px;
`;

const StyledListGroupItemText = styled(ListGroupItemText)`
  line-height: 18px;

  @media (max-width: 688px) {
    font-size: 0.9em;
  }
`;

type SneakerSearchBarProps = {
  sneakers: SearchBarSneaker[];
  onChooseSneaker: (sneaker: SearchBarSneaker) => void;
};

const SneakerSearchBar = (props: SneakerSearchBarProps) => {
  const [searchVal, setSearchVal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(0);

  const formatName = (sneaker: any) => [sneaker.brand, sneaker.name, sneaker.colorway].join(' ');

  const hideSuggestions = () => setShowSuggestions(false);
  const openSuggestions = () => setShowSuggestions(true);

  const result = !searchVal
    ? props.sneakers
    : props.sneakers.filter((sneaker) => formatName(sneaker).toLowerCase().indexOf(searchVal.toLowerCase()) > -1);

  const onChange = (evt: any) => {
    const { value } = evt.target;

    if (value === '') hideSuggestions();
    else openSuggestions();

    setSearchVal(value);
  };

  const clearSearchVal = () => setSearchVal('');

  const onConfirmVal = () => {
    props.onChooseSneaker(result[activeSuggestionIdx]);
    clearSearchVal();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveSuggestionIdx(0);
      setShowSuggestions(false);
      if (activeSuggestionIdx < result.length) onConfirmVal();
    } else if (e.key === 'ArrowUp') {
      if (activeSuggestionIdx === 0) return;
      setActiveSuggestionIdx(activeSuggestionIdx - 1);
    } else if (e.key === 'ArrowDown') {
      if (activeSuggestionIdx === result.length - 1) return;
      setActiveSuggestionIdx(activeSuggestionIdx + 1);
    } else if (e.key === 'Tab') hideSuggestions();
  };

  const onMouseDown = () => {
    setShowSuggestions(false);
    onConfirmVal();
  };

  return (
    <div style={{ position: 'relative' }}>
      <InputGroup>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInput autoFocus placeholder='Search...' value={searchVal} onChange={onChange} onKeyDown={onKeyDown} />
      </InputGroup>
      {showSuggestions && (
        <OutsideClickHandler handler={hideSuggestions}>
          <StyledListGroup>
            {result.map((item, idx) => (
              <StyledListGroupItem
                active={activeSuggestionIdx === idx}
                key={idx}
                onMouseOver={() => setActiveSuggestionIdx(idx)}
                onMouseDown={onMouseDown}
              >
                <ListItemImg src={item.mainDisplayImage} />
                <StyledListGroupItemText>{formatName(item)}</StyledListGroupItemText>
              </StyledListGroupItem>
            ))}
          </StyledListGroup>
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default SneakerSearchBar;
