'use client';

import React, { useState } from 'react';
import { SidebarFilter } from './SidebarFilter';
import { ProductMainArea } from './ProductMainArea';

export function ProductListLayout() {
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div className="flex flex-col md:flex-row gap-lg items-start">
      {isFilterVisible && (
        <div className="w-full md:w-64 flex-shrink-0 transition-all duration-300 origin-left">
          <SidebarFilter />
        </div>
      )}
      <ProductMainArea 
        isFilterVisible={isFilterVisible} 
        onToggleFilter={toggleFilter} 
      />
    </div>
  );
}
