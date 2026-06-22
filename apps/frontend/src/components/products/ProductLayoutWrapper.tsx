'use client';

import React, { useState, createContext, useContext } from 'react';

export const FilterContext = createContext({
  isVisible: true,
  toggle: () => {}
});

export const useFilter = () => useContext(FilterContext);

export function ProductLayoutWrapper({
  sidebar,
  children
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  return (
    <FilterContext.Provider value={{ isVisible: isFilterVisible, toggle: () => setIsFilterVisible(!isFilterVisible) }}>
      <div className="flex flex-col md:flex-row gap-lg items-start">
        {isFilterVisible && (
          <div className="w-full md:w-64 flex-shrink-0 transition-all duration-300 origin-left">
            {sidebar}
          </div>
        )}
        <div className="flex-grow flex flex-col min-w-0">
          {children}
        </div>
      </div>
    </FilterContext.Provider>
  );
}
