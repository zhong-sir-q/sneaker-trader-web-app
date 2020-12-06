import styled from 'styled-components'

export const Cell = styled.td`
  @media (max-width: 1124px) {
    display: none;
  }
`;

export const ShowDropdownHeader = styled.th`
  @media (min-width: 1124px) {
    display: none;
  }
`;

export const DropdownRow = styled.tr`
  font-weight: 600;
  font-size: 1.25em;

  @media (min-width: 1124px) {
    display: none;
  }
`;

export const ShowDropdownCell = styled.td`
  vertical-align: middle;
  text-align: center;

  @media (min-width: 1124px) {
    display: none;
  }
`;

export const Header = styled.th<{ minWidth: string }>`
  min-width: ${({ minWidth }) => minWidth};

  @media (max-width: 1124px) {
    display: none;
    width: 0;
  }
`;
