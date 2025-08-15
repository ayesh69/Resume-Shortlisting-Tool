import React, { useState } from 'react';
import axios from 'axios';

export default function Shortlist() {
  const [filters, setFilters] = useState({ skills: '', minExperience: '' });
  const [resumes, setResumes] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterClick = async () => {
    const response = await axios.get('/api/resume/filter', { params: filters });
    setResumes(response.data);
  };

  return (
    <div>
      <h2>Filter Resumes</h2>
      <input
        type="text"
        name="skills"
        placeholder="Skills (comma separated)"
        value={filters.skills}
        onChange={handleChange}
      />
      <input
        type="number"
        name="minExperience"
        placeholder="Min Experience (years)"
        value={filters.minExperience}
        onChange={handleChange}
      />
      <button onClick={handleFilterClick}>Filter</button>
      <ul>
        {resumes.map((r) => (
          <li key={r._id}>
            {r.name} - {r.email} - Skills: {r.skills.join(', ')} - Experience: {r.experience} years
          </li>
        ))}
      </ul>
    </div>
  );
}
