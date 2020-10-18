import React from "react";
import styled from 'styled-components'
import { ListGroupItem, ListGroupItemText, ListGroup } from "reactstrap";

const ListItemImg = styled.img`
  width: 100px;
  margin-right: 10px;

  @media (min-width: 768px) {
    width: 125px;
    margin-right: 20px;
  }
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

const Cancel = styled.div`
  position: absolute;
  right: 8px;
  top: 0;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
`;

type SearchResultItemProps = {
  onClose: () => void;
  imgSrc: string;
  itemText: string;
};

const SearchResultItem = (props: SearchResultItemProps) => (
  <ListGroup>
    <StyledListGroupItem>
      <Cancel onClick={props.onClose}>x</Cancel>
      <ListItemImg src={props.imgSrc} />
      <StyledListGroupItemText>{props.itemText}</StyledListGroupItemText>
    </StyledListGroupItem>
  </ListGroup>
);

export default SearchResultItem
