import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import uploadImage from '../../utils/uploadImage';

const EMPTY_FORM = {
  title: '',
  slug: '',
  tags: '',
  image: '',
  isPublished: true,
  sections: [
    { title: 'Introduction', content: '' },
    { title: 'Details', content: '' },
  ],
};

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    api.get('/blogs')
      .then(res => setBlogs(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load blogs'))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm({ ...EMPTY_FORM, sections: [{ title: 'Introduction', content: '' }, { title: 'Details', content: '' }] });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setForm({
      title: blog.title || '',
      slug: blog.slug || '',
      tags: (blog.tags || []).join(', '),
      image: blog.image || '',
      isPublished: blog.isPublished ?? true,
      sections: Array.isArray(blog.sections) && blog.sections.length > 0
        ? blog.sections
        : [{ title: 'Introduction', content: '' }],
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      image: form.image || undefined,
      isPublished: form.isPublished,
      sections: form.sections,
    };
    try {
      if (editingId) {
        const res = await api.put(`/blogs/${editingId}`, payload);
        setBlogs(prev => prev.map(b => b._id === editingId ? res.data.data : b));
      } else {
        const res = await api.post('/blogs', payload);
        setBlogs(prev => [res.data.data, ...prev]);
      }
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (index, field, value) => {
    setForm(prev => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], [field]: value };
      return { ...prev, sections };
    });
  };

  const addSection = () => setForm(prev => ({ ...prev, sections: [...prev.sections, { title: '', content: '' }] }));
  const removeSection = (i) => setForm(prev => ({ ...prev, sections: prev.sections.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-500 text-sm">Manage your website's blog posts.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="px-4 py-2 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Add New Blog
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {isAdding ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit Blog' : 'Add New Blog'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" required />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Slug (URL)</label>
                <input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" placeholder="auto-generated from title" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
                <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" placeholder="health, medicine, tips" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Cover Image</label>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setForm(prev => ({...prev, image: '__uploading__'}));
                  try {
                    const url = await uploadImage(file, 'cure-basket/blogs');
                    setForm(prev => ({...prev, image: url}));
                  } catch {
                    setForm(prev => ({...prev, image: ''}));
                  }
                }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" />
                {form.image === '__uploading__' && (
                  <p className="text-xs text-gray-400 mt-1">Uploading...</p>
                )}
                {form.image && form.image !== '__uploading__' && (
                  <img src={form.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg border border-gray-100" />
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="w-4 h-4 rounded" />
              Published
            </label>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-bold text-gray-900">Blog Sections</h4>
                <button type="button" onClick={addSection} className="text-sm text-[#006D6D] font-bold hover:underline flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Add Section
                </button>
              </div>
              <div className="space-y-6">
                {form.sections.map((section, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-[#006D6D] space-y-4">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3 w-full">
                        <span className="w-6 h-6 bg-[#006D6D]/10 text-[#006D6D] rounded-full flex items-center justify-center text-xs font-bold shrink-0">{index + 1}</span>
                        <input type="text" value={section.title} onChange={e => updateSection(index, 'title', e.target.value)} className="font-bold text-gray-800 bg-transparent border-b-2 border-dashed border-gray-200 focus:outline-none focus:border-[#006D6D] text-sm w-full py-1" placeholder="Section title..." required />
                      </div>
                      <button type="button" onClick={() => removeSection(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <textarea value={section.content} onChange={e => updateSection(index, 'content', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" rows="5" placeholder="Section content..." required />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={resetForm} className="px-5 py-2.5 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] disabled:opacity-60">{saving ? 'Saving...' : editingId ? 'Update Blog' : 'Save Blog'}</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Blog Title</th>
                  <th className="px-6 py-4">Tags</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{blog.title}</td>
                    <td className="px-6 py-4 text-gray-500">{(blog.tags || []).join(', ') || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${blog.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(blog)} className="p-2 text-gray-500 hover:text-[#006D6D] hover:bg-[#E6F7F7] rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(blog._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No blogs found. Add your first blog post!</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Blogs;
