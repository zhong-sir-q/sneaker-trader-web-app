import React from 'react';
import Checkout from './Checkout';

// TODO: pull data from api calls in here

// if the id is the primary key in the gatsby-mysql-plugin, it adds mysql__Products__ as the prefix to the pk
const rmPluginPrimaryKeyPrefix = (pk: string) => {
  const doubleUnderScoreSplit = pk.split('__');
  const result = doubleUnderScoreSplit[doubleUnderScoreSplit.length - 1];
  return result;
};

// TODO: handle the query error if the table in the database is empty
const Products = () => (
  <StaticQuery
    query={graphql`
      query allProducts {
        allMysqlProducts {
          edges {
            node {
              price
              price_id
              serial_number
              brand
              color_way
              description
              id
              name
              size
            }
          }
        }
      }
    `}
    render={(data) =>
      data.allMysqlProducts.edges.map((e: { node: any }) => {
        const id = rmPluginPrimaryKeyPrefix(e.node.id);
        const { price_id, name, description } = e.node;

        return <Product key={e.node.id} id={id} priceId={price_id} name={name} description={description} />;
      })
    }
  />
);


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
