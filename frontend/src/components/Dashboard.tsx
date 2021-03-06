import React from 'react';

// reactstrap components
import { Card, CardBody, Row, Col } from 'reactstrap';

import { Skeleton } from '@material-ui/lab';

import PanelHeader from './PanelHeader';
import TransactionDualHistoryTable from './dashboard/TransactionDualHistoryTable';
import SaleHistoryTable from './dashboard/SaleHistoryTable';

import ListedSneakerCounts from './dashboard/ListedSneakerCounts';
import UserRankingPoints from './dashboard/UserRankingPoints';
import SoldSneakerCounts from './dashboard/SoldSneakerCounts';
import MonthlyProfit from './dashboard/charts/MonthlyProfit';

import WalletBalance from './dashboard/WalletBalance';
import { useUserStatsCtx } from 'providers/marketplace/UserStatsProvider';
import TransactionTableProvider from 'providers/TransactionTableProvider';
import { useWalletCtx } from 'providers/WalletProvider';

/**
 * TODO:
 *
 * Graphs
 * - the value of your sneakers going up or down monthly (Trend)
 */

const StatSkeleton = () => <Skeleton height={150} />;

const Dashboard = () => {
  const { rankingPoints, listedSneakerCounts, completedSaleCounts, monthlyCumProfit } = useUserStatsCtx();

  const { walletBalance } = useWalletCtx();

  // check against undefined, because if if any of the value is 0, then it will render the spinner forever
  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <Row>
          <Col xs={12} md={12}>
            <Card className='card-stats card-raised'>
              <CardBody>
                <Row>
                  <Col md='3'>
                    {rankingPoints === undefined ? (
                      <StatSkeleton />
                    ) : (
                      <UserRankingPoints rankingPoints={rankingPoints} />
                    )}
                  </Col>
                  <Col md='3'>
                    {listedSneakerCounts === undefined ? (
                      <StatSkeleton />
                    ) : (
                      <ListedSneakerCounts counts={listedSneakerCounts} />
                    )}
                  </Col>
                  <Col md='3'>
                    {walletBalance === null ? <StatSkeleton /> : <WalletBalance balance={walletBalance} />}
                  </Col>
                  <Col md='3'>
                    {completedSaleCounts === undefined ? (
                      <StatSkeleton />
                    ) : (
                      <SoldSneakerCounts counts={completedSaleCounts} />
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            {monthlyCumProfit === undefined ? <Skeleton height={300} /> : <MonthlyProfit monthlyCumProfit={monthlyCumProfit} />}
          </Col>
        </Row>
        <Row>
          <TransactionTableProvider>
            <Col xs={12} md={12}>
              <TransactionDualHistoryTable />
            </Col>
            <Col xs={12} md={12}>
              <SaleHistoryTable />
            </Col>
          </TransactionTableProvider>
        </Row>
      </div>
    </React.Fragment>
  );
};


// const FBStyleChat = () => (
//   <ChatWrapper>
//     <ChatBoxContainer>
//       <ChatBoxFlexWrapper>
//         {Array(2)
//           .fill(0)
//           .map((_, idx) => (
//             <ChatBox key={idx} />
//           ))}
//       </ChatBoxFlexWrapper>
//     </ChatBoxContainer>
//     <AvatarListWrapper>
//       <AvatarList>
//         {Array(2)
//           .fill(0)
//           .map((_, idx) => (
//             <AvatarItem key={idx}>
//               <Edit />
//             </AvatarItem>
//           ))}
//       </AvatarList>
//     </AvatarListWrapper>
//   </ChatWrapper>
// );

// const ChatBoxContainer = styled.div``;

// // same margin size as the width of the list
// const ChatBoxFlexWrapper = styled.div`
//   display: flex;
//   margin-right: 80px;
// `;

// const ChatBox = styled.div`
//   width: 300px;
//   height: 400px;
//   background-color: red;
//   margin-left: 10px;
// `;

// const AvatarListWrapper = styled.div`
//   position: absolute;
//   right: 0;
//   bottom: 0;
// `;

// const AvatarList = styled.div`
//   width: 80px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const AvatarItem = styled.div``;

// const ChatWrapper = styled.div`
//   position: fixed;
//   right: 0;
//   bottom: 0;
// `;

export default Dashboard;
