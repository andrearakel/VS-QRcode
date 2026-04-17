import data from '../data/products.json';

export const getProduct = (id) => {
  return Promise.resolve(data.products.find((p) => p.id === id));
};

export const getAllProducts = () => {
  return Promise.resolve(data.products);
};

export const getProducer = () => {
  return Promise.resolve(data.producer);
};