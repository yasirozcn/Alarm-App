/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import '../styles/check.css';

function Check({ setResults, setLoading }) {
  const [formData, setFormData] = useState({
    nereden: '',
    nereye: '',
  });
  const [date, setDate] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    setDate(e.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the date as "dd.mm.yy"
    const formattedDate = date ? date.toLocaleDateString('tr-TR') : '';

    // Combine formData with the formatted date
    const finalFormData = {
      ...formData,
      dateInput: formattedDate,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/scrape',
        finalFormData
      );
      console.log('API Response:', response.data);
      setResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Hata:', error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nereden">Nereden:</label>
          <input
            type="text"
            id="nereden"
            name="nereden"
            value={formData.nereden}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="nereye">Nereye:</label>
          <input
            type="text"
            id="nereye"
            name="nereye"
            value={formData.nereye}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="dateInput">Tarih:</label>
          <Calendar
            value={date}
            onChange={handleDateChange}
            dateFormat="dd.mm.yy"
            showIcon
            className="custom-calendar"
          />
        </div>
        <button type="submit">Sorgula</button>
      </form>
    </div>
  );
}

export default Check;
