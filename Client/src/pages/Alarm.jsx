/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

function Alarm({ results }) {
  // State to manage selected items
  const [selectedItems, setSelectedItems] = useState([]);

  // Handler to toggle selection
  const handleCheckboxChange = (key, subKey, subValue) => {
    const item = { key, subKey, subValue };
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.some((i) => i.key === key && i.subKey === subKey)
        ? prevSelectedItems.filter((i) => i.key !== key || i.subKey !== subKey)
        : [...prevSelectedItems, item]
    );
  };

  // Handler to handle button click
  const handleButtonClick = () => {
    console.log('Selected Items:', selectedItems);
  };

  const renderResults = () => {
    if (!results || Object.keys(results).length === 0) {
      return <p>No results available.</p>;
    }

    return Object.entries(results).map(([key, value], index) => {
      if (typeof value === 'object' && value !== null) {
        return (
          <li key={index}>
            {key}:
            <ul>
              {Object.entries(value).map(([subKey, subValue], subIndex) => (
                <li key={subIndex}>
                  <input
                    type="checkbox"
                    id={`${key}-${subKey}`}
                    onChange={() => handleCheckboxChange(key, subKey, subValue)}
                  />
                  <label htmlFor={`${key}-${subKey}`}>
                    {subKey}: {subValue}
                  </label>
                </li>
              ))}
            </ul>
          </li>
        );
      } else {
        return (
          <li key={index}>
            <input
              type="checkbox"
              id={key}
              onChange={() => handleCheckboxChange(key, null, value)}
            />
            <label htmlFor={key}>
              {key}: {value}
            </label>
          </li>
        );
      }
    });
  };

  return (
    <div>
      <h2>Alarm Results</h2>
      <ul>{renderResults()}</ul>
      {selectedItems.length > 0 && (
        <button onClick={handleButtonClick}>Alarm Kur</button>
      )}
    </div>
  );
}

export default Alarm;
