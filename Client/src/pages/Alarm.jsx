/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

function Alarm({ results }) {
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
                <li
                  onClick={() => console.log(subKey, subValue)}
                  key={subIndex}
                >
                  {subKey}: {subValue}
                </li>
              ))}
            </ul>
          </li>
        );
      } else {
        return (
          <li key={index}>
            {key}: {value}
          </li>
        );
      }
    });
  };

  return (
    <div>
      <h2>Alarm Results</h2>
      <ul>{renderResults()}</ul>
    </div>
  );
}

export default Alarm;
