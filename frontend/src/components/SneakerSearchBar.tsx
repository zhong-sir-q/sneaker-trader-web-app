import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import { ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap';

// import InfiniteScroll from 'react-infinite-scroll-component';

import OutsideClickHandler from './OutsideClickHandler';
import { SearchBarSneaker } from '../../../shared';

const StyledInput = styled.input`
  width: 100%;
  padding-left: 35px;
  border-radius: 3px;
  border: none;
  background-color: #f6f6f6;
  padding-right: 15px;
  box-shadow: none;
  text-overflow: ellipsis;
  height: 44px;

  /* apply margin to the input before collapse */
  @media (min-width: 991px) {
    margin-right: 15px;
  }

  &:focus {
    outline: none;
  }
`;

const SearchIconOutternWrapper = styled.div`
  position: relative;
  padding-left: 6px;
`;

const SearchIconInnerWrapper = styled.div`
  position: absolute;
  top: 10px;
`;

const StyledListGroup = styled(ListGroup)<{ maxheight: string }>`
  position: absolute;
  margin-top: 5px;
  z-index: 1;
  width: 100%;
  overflow: auto;
  max-height: ${(props) => props.maxheight || '70vh'};
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
  placeholder?: string;
  suggestionMaxHeight?: string;
  width?: string;
  onChooseSneaker: (sneaker: SearchBarSneaker) => void;
  setSneakerNew?: () => void;
  setSneakerExists?: () => void;
  updateSearchVal?: (searchVal: string) => void;
};

const SneakerSearchBar = (props: SneakerSearchBarProps) => {
  const [searchVal, setSearchVal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(0);

  const { setSneakerExists, setSneakerNew, updateSearchVal } = props;

  const formatName = (sneaker: any) => [sneaker.brand, sneaker.name, sneaker.colorway].join(' ');

  const hideSuggestions = () => setShowSuggestions(false);
  const openSuggestions = () => setShowSuggestions(true);

  const result = !searchVal
    ? props.sneakers
    : props.sneakers.filter((sneaker) => formatName(sneaker).toLowerCase().indexOf(searchVal.toLowerCase()) > -1);

  useEffect(() => {
    if (setSneakerExists && setSneakerNew) {
      if (result.length > 0 || !searchVal) setSneakerExists();
      else setSneakerNew();
    }
  });

  const onChange = (evt: any) => {
    const { value } = evt.target;

    if (value === '') hideSuggestions();
    else openSuggestions();

    setSearchVal(value);

    if (updateSearchVal) updateSearchVal(value);
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
    } else if (e.key === 'Tab' || e.key === 'Escape') hideSuggestions();
  };

  const onMouseDown = () => {
    setShowSuggestions(false);
    onConfirmVal();
  };

  return (
    <div style={{ position: 'relative', width: props.width }}>
      <StyledInputGroup>
        <SearchIconOutternWrapper>
          <SearchIconInnerWrapper>
            <SearchIcon />
          </SearchIconInnerWrapper>
        </SearchIconOutternWrapper>
        <StyledInput
          placeholder={props.placeholder || 'Search for brand, color, etc...'}
          value={searchVal}
          onChange={onChange}
          onKeyDown={onKeyDown}
          data-testid='listing-form-search-bar'
          onFocus={() => openSuggestions()}
        />
      </StyledInputGroup>
      {showSuggestions && (
        <OutsideClickHandler handler={hideSuggestions}>
          <StyledListGroup maxheight={props.suggestionMaxHeight}>
            {result.map((item, idx) => (
              <StyledListGroupItem
                active={activeSuggestionIdx === idx}
                key={idx}
                onMouseOver={() => setActiveSuggestionIdx(idx)}
                onMouseDown={onMouseDown}
              >
                <BackgroundImg background={item.mainDisplayImage} />
                <StyledListGroupItemText>{formatName(item)}</StyledListGroupItemText>
              </StyledListGroupItem>
            ))}
          </StyledListGroup>
        </OutsideClickHandler>
      )}
    </div>
  );
};

const StyledInputGroup = styled.div``;

// similar component used in PreviewImageDropzone
type BackgroundImgProps = {
  background: string;
};

const BackgroundImg = styled.div<BackgroundImgProps>`
  background-image: url(${({ background }) => `"${background}"`});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  padding-bottom: 25%;
  padding-left: 25%;
  margin-right: 8px;

  @media (max-width: 768px) {
    padding-bottom: 30%;
    padding-left: 30%;
  }
`;

export default SneakerSearchBar;
