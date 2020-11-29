import { Button } from "reactstrap";
import styled from "styled-components";

const DashboardButton = styled(Button)`
  font-size: 11px;
  padding: 5px 10px;
`;

export const ContactButton = styled(DashboardButton)`
  background-color: #1e90ff;
`;

export const CompleteSaleButton = styled(DashboardButton)`
  background-color: #008000;
`;

export const RatingButton = styled(DashboardButton)`
  cursor: pointer;
`;

export const RemoveButton = styled(DashboardButton)`
  cursor: pointer;
`;
