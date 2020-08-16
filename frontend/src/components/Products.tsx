import React, { useEffect, useState } from 'react';
import Checkout from './Checkout';
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
        <Product key={p.id} {...p} priceId={p.price_id} />
      ))}
    </React.Fragment>
  );
};

interface ProductProps {
  priceId: string;
  name: string;
  description: string;
  id: string;
}

const Product = (props: ProductProps) => {
  const { id, name, description, priceId } = props;

  return (
    <div>
      <p>{name}</p>
      <p>{description}</p>
      <Checkout priceId={priceId} productId={id} />
    </div>
  );
};

export default Products;
