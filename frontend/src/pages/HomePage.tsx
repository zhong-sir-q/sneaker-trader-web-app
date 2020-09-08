import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import { Row, Col, Container } from 'reactstrap';
import styled from 'styled-components';

import SneakerGallery from 'components/SneakerGallery';
import { getGallerySneakers, getSneakersBySize } from 'api/api';

import { Sneaker } from '../../../shared';

const FilterBlock = styled(Col)<{ isSelected: boolean }>`
  font-weight: 600;
  font-family: BebasNeue;
  text-align: center;
  background-color: #f5f5f5;
  max-width: 48px;
  margin: 2%;
  padding: 1% 0;
  cursor: pointer;
  color: ${(props) => (props.isSelected ? '#f96332' : '')};
  flex: 0 0 25%;
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
type FilterTitle = 'brands' | 'sizes';

type FiltersProps = {
  filters: FilterType[];
  title: FilterTitle;
};

const Filters = (props: FiltersProps) => {
  const history = useHistory();

  const { filters, title } = props;

  const formatQueryParams = (params: URLSearchParams) => `/?${params.toString()}`;

  const onSelectFilter = (filter: FilterType) => {
    const params = new URLSearchParams(history.location.search);

    if (String(filter) === params.get(title)) {
      params.delete(title);
      if (params.toString().length === 0) history.push('/');
      else history.push(formatQueryParams(params));
    } else {
      params.delete(title);
      params.append(title, String(filter));
      history.push(formatQueryParams(params));
    }
  };

  const isFilterSelected = (val: string) => val === queryString.parse(history.location.search)[title];

  const renderGrid = (items: any[]) => {
    return (
      <Row>
        {items.map((iVal, idx) => (
          <FilterBlock onClick={() => onSelectFilter(iVal)} isSelected={isFilterSelected(String(iVal))} key={idx}>
            {iVal}
          </FilterBlock>
        ))}
      </Row>
    );
  };

  return (
    <div>
      <FilterTitle>{title}</FilterTitle>
      {renderGrid(filters)}
    </div>
  );
};

const HomePage = () => {
  const [defaultSneakers, setDefaultSneakers] = useState<Sneaker[]>([]);
  const [filterSneakers, setFilterSneakers] = useState<Sneaker[]>([]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const gallerySneakers = await getGallerySneakers();
      setDefaultSneakers(gallerySneakers);
      setFilterSneakers(gallerySneakers);
    })();
  }, []);

  const queryHandler = async (brands: string, sizes: string) => {
    if (brands && sizes) {
      const sneakersBySize = await getSneakersBySize(sizes as string);
      setFilterSneakers(sneakersBySize.filter((s) => s.brand === brands));
    } else if (brands) {
      setFilterSneakers(defaultSneakers.filter((s) => s.brand === brands));
    } else if (sizes) {
      const sneakersBySize = await getSneakersBySize(sizes as string);
      setFilterSneakers(sneakersBySize);
    } else setFilterSneakers(defaultSneakers);
  };

  const filtersHandler = useCallback(queryHandler, [filterSneakers]);

  // TODO: add the functionality such that, without re-rendering forever,
  // sneakers are filtered after the user enters the path
  useEffect(() => {
    const unlisten = history.listen((location) => {
      const { brands, sizes } = queryString.parse(location.search);
      filtersHandler(brands as string, sizes as string);
    });

    return () => unlisten();
  });

  return (
    <Container fluid='md' style={{ minHeight: 'calc(100vh - 150px)' }}>
      <Row>
        {/* TODO: how do I left align the sizes title in the grid??? */}
        <Col sm={2}>
          <Filters filters={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} title='sizes' />
          <Filters filters={['Nike', 'Air Jordan', 'Under Armor']} title='brands' />
        </Col>
        <Col sm={10}>
          <SneakerGallery sneakers={filterSneakers} />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
