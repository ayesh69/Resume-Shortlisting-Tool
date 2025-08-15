import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ResumeManager = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    resumeFile: null,
  });
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's resumes
  useEffect(() => {
  if (!user) return;

  {/*const fetchResumes = async () => {
    try {
      const res = await axios.get('/api/resumes', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('Fetched resumes:', res.data); 
      setResumes(res.data);
    } catch (err) {
      alert('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  fetchResumes();
}, [user]);
*/}

  const fetchResumes = async () => {
    try {
      let url = `/api/resumes`;
      url += `?userId=${user._id}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setResumes(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch your resumes');
    } finally {
      setLoading(false);
    }
  };

  fetchResumes();
}, [user]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resumeFile: e.target.files[0] });
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
      const res = await axios.post('/api/resumes/submit', data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Resume submitted successfully!');
      // Optionally add to state
      setResumes([...resumes, res.data]);
      setFormData({
        name: '',
        email: '',
        skills: '',
        experience: '',
        resumeFile: null,
      });
    } catch (err) {
      console.error(err);
      alert('Error submitting resume');
    }
  };

  const handleDelete = async (resumeId) => {
    try {
      await axios.delete(`/api/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setResumes(resumes.filter((r) => r._id !== resumeId));
      alert('Resume deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete resume');
    }
  };

  const handleUpdate = async (resumeId, updatedData) => {
  try {
    const data = new FormData();
    if (updatedData.name) data.append('name', updatedData.name);
    if (updatedData.email) data.append('email', updatedData.email);
    if (updatedData.skills) data.append('skills', updatedData.skills);
    if (updatedData.experience) data.append('experience', updatedData.experience);
    if (updatedData.resumeFile) data.append('resumeFile', updatedData.resumeFile);

    const res = await axios.put(`/api/resumes/${resumeId}`, data, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Update the local state
    setResumes(prevResumes =>
      prevResumes.map(r => (r._id === resumeId ? res.data : r))
    );

    alert('Resume updated successfully!');
  } catch (err) {
    console.error(err);
    alert('Failed to update resume');
  }
};


  if (!user) return <p>Loading user info...</p>;
  if (loading) return <p>Loading resumes...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Submit a Resume</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8">
        <input
          name="name"
          onChange={handleChange}
          value={formData.name}
          placeholder="Name"
          className="w-full border p-2 mb-3"
          required
        />
        <input
          name="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="Email"
          className="w-full border p-2 mb-3"
          required
        />
        <input
          name="skills"
          onChange={handleChange}
          value={formData.skills}
          placeholder="Skills (comma separated)"
          className="w-full border p-2 mb-3"
          required
        />
        <input
          name="experience"
          onChange={handleChange}
          value={formData.experience}
          placeholder="Years of experience"
          type="number"
          className="w-full border p-2 mb-3"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-3"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Submit Resume
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Your Submitted Resumes</h2>
      {resumes.length === 0 ? (
        <p>No resumes submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {resumes.map((r) => (
            <li key={r._id} className="border p-4 rounded bg-gray-50">
              <p><strong>{r.name}</strong> — {r.experience} yrs</p>
              <p>Email: {r.email}</p>
              <p>Skills: {(r.skills || []).join(', ')}</p>
              {r.resumeFile && (
                <p>
                  <a
                    href={`/uploads/${r.resumeFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Resume
                  </a>
                </p>
              )}
              <button
                onClick={() => handleDelete(r._id)}
                className="bg-red-600 text-white px-4 py-2 rounded mt-2"
              >
                Delete
              </button>
              <button
  onClick={() => {
    const updatedName = prompt("Enter new name", r.name);
    const updatedSkills = prompt("Enter new skills (comma separated)", r.skills.join(', '));
    handleUpdate(r._id, { name: updatedName, skills: updatedSkills });
  }}
  className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 ml-2"
>
  Edit
</button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResumeManager;
