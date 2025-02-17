import React from 'react';

const FilterCard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
      <h2 className="text-xl font-bold mb-4">Filtres</h2>
      <div className="flex flex-col space-y-2">
        <label className="flex items-center">
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
          <span className="ml-2 text-lg">Filtre 1</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
          <span className="ml-2 text-lg">Filtre 2</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
          <span className="ml-2 text-lg">Filtre 3</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
          <span className="ml-2 text-lg">Filtre 4</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
          <span className="ml-2 text-lg">Filtre 5</span>
        </label>
      </div>
    </div>
  );
};

export default FilterCard;