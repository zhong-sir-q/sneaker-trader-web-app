import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Container } from 'reactstrap';
import styled from 'styled-components';

import queryString from 'query-string';
import { useHistory } from 'react-router-dom';

import SneakerGallery from 'components/SneakerGallery';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';

import { useAuth } from 'providers/AuthProvider';
import { HOME } from 'routes';

import { range } from 'utils/utils';
import { GallerySneaker } from '../../../shared';

const FilterBlock = styled(Col)<{ selected: boolean }>`
  font-weight: 600;
  font-family: BebasNeue;
  text-align: center;
  background-color: #f5f5f5;
  margin: 2%;
  padding: 1% 5px;
  cursor: pointer;
  color: ${(props) => (props.selected ? '#f96332' : '')};
`;

const FilterTitle = styled.div`
  font-family: proxima-nova, sans-serif;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 7px;
  letter-spacing: 1px;
`;

type FilterType = string | number;
type FilterByKey = 'brand' | 'size';

type FiltersProps = {
  filters: FilterType[];
  filterKey: FilterByKey;
  title: string;
};

const Filters = (props: FiltersProps) => {
  const history = useHistory();

  const { filters, filterKey, title } = props;

  const formatQueryParams = (params: URLSearchParams) => `/?${params.toString()}`;

  const onSelectFilter = (filter: FilterType) => {
    const params = new URLSearchParams(history.location.search);

    if (String(filter) === params.get(filterKey)) {
      params.delete(filterKey);
      if (params.toString().length === 0) history.push(HOME);
      else history.push(formatQueryParams(params));
    } else {
      params.delete(filterKey);
      params.append(filterKey, String(filter));
      history.push(formatQueryParams(params));
    }
  };

  const isFilterSelected = (val: string) => val === queryString.parse(history.location.search)[filterKey];

  const renderGrid = (items: any[]) => {
    return (
      <Row>
        {items.map((iVal, idx) => (
          <FilterBlock onClick={() => onSelectFilter(iVal)} selected={isFilterSelected(String(iVal))} key={idx}>
            {iVal}
          </FilterBlock>
        ))}
      </Row>
    );
  };

  return (
    <div style={{ marginBottom: '25px' }}>
      <FilterTitle>{title}</FilterTitle>
      {renderGrid(filters)}
    </div>
  );
};

const HomePage = () => {
  const [defaultSneakers, setDefaultSneakers] = useState<GallerySneaker[]>([]);
  const [filterSneakers, setFilterSneakers] = useState<GallerySneaker[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const { currentUser, signedIn } = useAuth();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      let gallerySneakers: GallerySneaker[] = [];

      // if the user is not logged in, then render all gallery sneakers
      if (!signedIn) gallerySneakers = await ListedSneakerControllerInstance.getGallerySneakers(-1);
      else if (currentUser) gallerySneakers = await ListedSneakerControllerInstance.getGallerySneakers(currentUser.id);

      setDefaultSneakers(gallerySneakers);
      setFilterSneakers(gallerySneakers);

      setBrands(await HelperInfoControllerInstance.getBrands());
    })();
  }, [signedIn, currentUser]);

  const queryHandler = async (brand: string, size: number) => {
    if (brand && size) {
      const sneakersBySize = await ListedSneakerControllerInstance.getGallerySneakersBySize(
        currentUser ? currentUser.id : -1,
        size
      );
      setFilterSneakers(sneakersBySize.filter((s) => s.brand === brand));
    } else if (brand) {
      setFilterSneakers(defaultSneakers.filter((s) => s.brand === brand));
    } else if (size) {
      const sneakersBySize = await ListedSneakerControllerInstance.getGallerySneakersBySize(
        currentUser ? currentUser.id : -1,
        size
      );
      setFilterSneakers(sneakersBySize);
    } else setFilterSneakers(defaultSneakers);
  };

  const filtersHandler = useCallback(queryHandler, [filterSneakers]);

  useEffect(() => {
    const unlisten = history.listen((location) => {
      const { brand, size } = queryString.parse(location.search);
      filtersHandler(brand as string, Number(size));
    });

    return () => unlisten();
  });

  return (
    <Container fluid='sm' style={{ minHeight: 'calc(100vh - 150px)' }}>
      <Row>
        <Col sm={2}>
          <Filters filters={range(1, 12, 1)} filterKey='size' title='us sizes' />
          <Filters filters={brands} filterKey='brand' title='brands' />
        </Col>
        <Col sm={10}>
          <SneakerGallery sneakers={filterSneakers} />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
