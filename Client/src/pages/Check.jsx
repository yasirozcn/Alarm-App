/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import '../styles/check.css';

const trainLines = {
  lines: [
    {
      name: 'Ankara - İstanbul YHT',
      stops: [
        'Ankara Gar',
        'Polatlı',
        'Eskişehir',
        'Bozüyük',
        'Bilecik',
        'Arifiye',
        'İzmit',
        'Gebze',
        'Pendik',
        'Bostancı',
        'Söğütlüçeşme',
      ],
    },
    {
      name: 'Ankara - Konya YHT',
      stops: ['Ankara Gar', 'Eryaman', 'Polatlı', 'Konya Gar'],
    },
    {
      name: 'İstanbul - Konya YHT',
      stops: [
        'İstanbul(Söğütlüçeşme)',
        'İstanbul(Bostancı)',
        'İstanbul(Pendik)',
        'Gebze',
        'İzmit',
        'Arifiye',
        'Bozüyük',
        'Eskişehir',
        'Polatlı',
        'Konya Gar',
      ],
    },
    {
      name: 'Ankara - Eskişehir YHT',
      stops: ['Ankara Gar', 'Eryaman', 'Polatlı', 'Eskişehir'],
    },
    {
      name: 'İstanbul - Eskişehir YHT',
      stops: [
        'İstanbul(Söğütlüçeşme)',
        'İstanbul(Bostancı)',
        'İstanbul(Pendik)',
        'Gebze',
        'İzmit',
        'Arifiye',
        'Bozüyük',
        'Eskişehir',
      ],
    },
    {
      name: 'Ankara - Sivas YHT',
      stops: [
        'Ankara Gar',
        'Elmadağ',
        'Kırıkkale',
        'Yerköy',
        'Yozgat',
        'Sivas',
      ],
    },
  ],
};

function Check({ setResults, setLoading }) {
  const [formData, setFormData] = useState({
    nereden: '',
    nereye: '',
  });
  const [date, setDate] = useState(null);
  const [availableDestinations, setAvailableDestinations] = useState([]); // 'Nereye' dropdown'u için uygun duraklar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // "Nereden" seçildiğinde, ona uygun "Nereye" duraklarını güncelle
    if (name === 'nereden') {
      updateAvailableDestinations(value);
    }
  };

  const updateAvailableDestinations = (nereden) => {
    let destinations = [];
    trainLines.lines.forEach((line) => {
      if (line.stops.includes(nereden)) {
        destinations = [...new Set([...destinations, ...line.stops])]; // Her hattaki durakları ekle
      }
    });
    // "Nereden" durağını "Nereye" seçeneklerinden çıkar
    const filteredDestinations = destinations.filter(
      (stop) => stop !== nereden
    );
    setAvailableDestinations(filteredDestinations);
  };

  const handleDateChange = (e) => {
    setDate(e.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tarihi "dd.mm.yy" formatında biçimlendir
    const formattedDate = date ? date.toLocaleDateString('tr-TR') : '';

    // Form verilerini tarih ile birleştir
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
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nereden">Nereden:</label>
          <select
            id="nereden"
            name="nereden"
            value={formData.nereden}
            onChange={handleChange}
          >
            {trainLines.lines.map((line) =>
              line.stops.map((stop) => (
                <option key={stop} value={stop}>
                  {stop}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label htmlFor="nereye">Nereye:</label>
          <select
            id="nereye"
            name="nereye"
            value={formData.nereye}
            onChange={handleChange}
            disabled={!formData.nereden} // "Nereden" seçilmeden "Nereye" seçilemez
          >
            {availableDestinations.map((stop) => (
              <option key={stop} value={stop}>
                {stop}
              </option>
            ))}
          </select>
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
