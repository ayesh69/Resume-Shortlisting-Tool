import React, { useState } from 'react';
import axios from 'axios';

export default function ResumeSubmit() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    resumeFile: null,
  });

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setFormData({...formData, resumeFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('skills', formData.skills);
    data.append('experience', formData.experience);
    data.append('resumeFile', formData.resumeFile);

    try {
      await axios.post('/api/resume/submit', data);
      alert('Resume submitted!');
      
    } catch (err) {
      alert('Error submitting resume.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} placeholder="Name" required />
      <input name="email" onChange={handleChange} placeholder="Email" required />
      <input name="skills" onChange={handleChange} placeholder="Skills (comma separated)" required />
      <input name="experience" onChange={handleChange} placeholder="Years of experience" type="number" required />
      <input type="file" onChange={handleFileChange}  />
      <button type="submit">Submit Resume</button>
    </form>
  );
}
