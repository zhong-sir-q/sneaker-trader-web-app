import React from 'react';

import { AuthStateContext } from 'providers/AuthStateProvider';


/**
 * TODO:
 * - delete the commit history credentials that I have stored on devops
 */

const INIT_STATE = {
  size: '',
  brand: '',
  color_way: '',
  serial_number: '',
  description: '',
  name: '',
  price: '', // price in dollars
};

// type of Product excluding the product and the price id
type SneakerFormData = typeof INIT_STATE;

/**
 * TODO
 * - validate the form as the user is typing, i.e. only allow numeric characters in the size and price field
 * - validate the response when the user submits the form
 * - allow the user to upload images about the shoes. Possible business logic, quality, no. of images allowed etc.?
 *   - own file hosting service
 *   - render the images when pulling from the bucket
 *
 * can use Formik to handle the form logic
 */

/**
 * a multi-step form to list a new product
 * - for simplicity sake, the name of the shoe will be whatever the user inputs (StockX seems to have the names of the shoes fixed)
 * - info for API calls (name, description, images (maybe use a S3 bucket to store them), price)
 * - shoe brand will be a dropdown and auto-suggestion, same with the color way
 * - shoe size will be a dropdown select
 */
const validSneakerInfo = (sneakerFormaData: SneakerFormData) => true;

const NewProductForm = () => {
  const { isUserSignedIn } = React.useContext(AuthStateContext);
  const [sneakerInfo, setSneakerInfo] = React.useState<SneakerFormData>(INIT_STATE);

  const onChange = (evt: React.ChangeEvent) =>
    setSneakerInfo({
      ...sneakerInfo,
      [(evt.target as any).name]: (evt.target as any).value,
    });

  const confirmCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUserSignedIn()) {
      alert('You must be signed in to create the product');
      return;
    }

    if (validSneakerInfo(sneakerInfo)) {
    } else alert('Some of the fields is invalid');
  };

  return (
    <form onSubmit={confirmCreateProduct}>
      <div>Size</div>
      <input name="size" value={sneakerInfo.size} onChange={onChange} />
      <p>Brand</p>
      <input name="brand" value={sneakerInfo.brand} onChange={onChange} />
      <p>Color Way</p>
      <input name="color_way" value={sneakerInfo.color_way} onChange={onChange} />
      <p>Serial Number</p>
      <input name="serial_number" value={sneakerInfo.serial_number} onChange={onChange} />
      <p>Description</p>
      <input name="description" value={sneakerInfo.description} onChange={onChange} />
      <p>Name</p>
      <input name="name" value={sneakerInfo.name} onChange={onChange} />
      <p>Price</p>
      <input name="price" value={sneakerInfo.price} onChange={onChange} />
      <button type="submit" style={{ display: 'block' }}>
        Create new product
      </button>
    </form>
  );
};

export default NewProductForm;
