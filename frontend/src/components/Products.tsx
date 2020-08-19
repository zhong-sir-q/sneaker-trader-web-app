import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from 'routes';
import { DbSneaker } from '../../../shared';

const fetchAllProducts = async (): Promise<DbSneaker[]> => {
  const endpoint = API_BASE_URL + 'products';
  const response = await fetch(endpoint);
  const { products } = await response.json();

  return products;
};

const Products = () => {
  const [products, setProducts] = useState<DbSneaker[]>([]);

  useEffect(() => {
    (async () => setProducts(await fetchAllProducts()))();
  }, [products, setProducts]);

  return (
    <React.Fragment>
      {products.map((p) => (
        <Product key={p.id} {...p} />
      ))}
    </React.Fragment>
  );
};

interface ProductProps {
  name: string;
  description: string;
  id: string;
}

const Product = (props: ProductProps) => {
  const { name, description } = props;

  return (
    <div>
      <p>{name}</p>
      <p>{description}</p>
    </div>
  );
};

export default Products;
