import React from 'react';
import { SidebarFilter } from './SidebarFilter';
import { ProductMainArea } from './ProductMainArea';
import { ProductLayoutWrapper } from './ProductLayoutWrapper';

export function ProductListLayout({ products, pagination, categories, totalItems }: any) {
  return (
    <ProductLayoutWrapper sidebar={<SidebarFilter categories={categories} />}>
      <ProductMainArea products={products} pagination={pagination} totalItems={totalItems} />
    </ProductLayoutWrapper>
  );
}
