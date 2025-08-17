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

  useEffect(() => {
    if (!user) return;

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

    // ✅ add the single new resume object to the list
    setResumes((prev) => [...prev, res.data]);

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
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #f0f4ff 50%, #e6ecff 100%)',
        padding: '30px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#1f2937',
      }}
    >
      <div
        className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg"
        style={{ border: '1px solid #cbd5e1', display: 'flex', gap: '40px', flexWrap: 'wrap' }}
      >
        {/* Left block: Submit Resume Form */}
        <div style={{ flex: '1 1 350px', minWidth: '300px' }}>
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-700" style={{ letterSpacing: '0.05em' }}>
            Submit a Resume
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              onChange={handleChange}
              value={formData.name}
              placeholder="Name"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1.5px solid #a5b4fc',
                fontSize: '16px',
                boxShadow: 'inset 0 1px 3px rgb(163 175 255 / 0.25)',
              }}
            />
            <input
              name="email"
              onChange={handleChange}
              value={formData.email}
              placeholder="Email"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1.5px solid #a5b4fc',
                fontSize: '16px',
                boxShadow: 'inset 0 1px 3px rgb(163 175 255 / 0.25)',
              }}
            />
            <input
              name="skills"
              onChange={handleChange}
              value={formData.skills}
              placeholder="Skills (comma separated)"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1.5px solid #a5b4fc',
                fontSize: '16px',
                boxShadow: 'inset 0 1px 3px rgb(163 175 255 / 0.25)',
              }}
            />
            <input
              name="experience"
              onChange={handleChange}
              value={formData.experience}
              placeholder="Years of experience"
              type="number"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1.5px solid #a5b4fc',
                fontSize: '16px',
                boxShadow: 'inset 0 1px 3px rgb(163 175 255 / 0.25)',
              }}
            />
            <input type="file" onChange={handleFileChange} style={{ marginTop: '4px', marginBottom: '20px' }} />

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#5c6ac4',
                color: '#fff',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '17px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(92, 106, 196, 0.4)',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#454f9b')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5c6ac4')}
            >
              Submit Resume
            </button>
          </form>
        </div>

        {/* Right block: Submitted Resumes */}
        {/* Right block: Submitted Resumes */}
<div style={{ flex: '2 1 600px', minWidth: '300px' }}>
  <h2
    className="text-2xl font-semibold mb-5 text-indigo-700"
    style={{ letterSpacing: '0.03em' }}
  >
    Your Submitted Resumes
  </h2>

  {Array.isArray(resumes) && resumes.length > 0 ? (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        padding: 0,
        listStyle: 'none',
        margin: 0,
      }}
    >
      {resumes.map((r) => (
        <li
          key={r._id}
          style={{
            backgroundColor: '#f9fafb',
            borderRadius: '10px',
            padding: '18px 24px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
            borderLeft: '6px solid #5c6ac4',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <div>
            <p
              style={{
                fontWeight: '700',
                fontSize: '18px',
                marginBottom: '6px',
              }}
            >
              {r.name} — {r.experience} yrs
            </p>
            <p style={{ color: '#4f46e5', marginBottom: '4px' }}>
              Email: {r.email}
            </p>
            <p style={{ marginBottom: '10px' }}>
              Skills: {(r.skills || []).join(', ')}
            </p>
            {r.resumeFile && (
              <p style={{ marginBottom: '10px' }}>
                <a
                  href={`/uploads/${r.resumeFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#4f46e5', textDecoration: 'underline' }}
                >
                  View Resume
                </a>
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
            <button
              onClick={() => handleDelete(r._id)}
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#b91c1c')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#ef4444')
              }
            >
              Delete
            </button>
            <button
              onClick={() => {
                const updatedName = prompt('Enter new name', r.name);
                const updatedSkills = prompt(
                  'Enter new skills (comma separated)',
                  (r.skills || []).join(', ')
                );
                handleUpdate(r._id, {
                  name: updatedName,
                  skills: updatedSkills,
                });
              }}
              style={{
                backgroundColor: '#fbbf24',
                color: '#1e293b',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(251, 191, 36, 0.5)',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#b45309')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#fbbf24')
              }
            >
              Edit
            </button>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p style={{ fontSize: '16px', color: '#475569' }}>
      No resumes submitted yet.
    </p>
  )}
</div>
</div>
</div>
  );
};

export default ResumeManager;
