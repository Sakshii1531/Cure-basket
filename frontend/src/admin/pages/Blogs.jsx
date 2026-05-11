import React, { useState, useEffect } from 'react';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    image: '',
    author: 'CureBasket Medical Team',
    date: new Date().toISOString().split('T')[0],
    readingTime: '5 min read',
    sections: [
      { title: 'Introduction', content: '' },
      { title: 'Causes', content: '' },
      { title: 'Symptoms', content: '' }
    ]
  });

  useEffect(() => {
    const savedBlogs = localStorage.getItem('cb_blogs');
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    } else {
      // Default blogs fallback if empty
      const defaultBlogs = [
        {
          id: 1,
          title: "How to Safely Remove a Splinter",
          slug: "splinter",
          category: "First Aid",
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3",
          author: "CureBasket Medical Team",
          date: "2026-05-11",
          readingTime: "8 min read",
          sections: [
            { title: 'Introduction', content: "A splinter is a small fragment of a foreign object that becomes embedded in the skin..." },
            { title: 'Causes', content: "Splinters are most commonly caused by direct contact with materials that can fragment easily..." },
            { title: 'Symptoms', content: "Most splinters are visible to the naked eye, but some may be buried deeper under the skin..." }
          ]
        }
      ];
      setBlogs(defaultBlogs);
      localStorage.setItem('cb_blogs', JSON.stringify(defaultBlogs));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionTitleChange = (index, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index].title = value;
    setFormData(prev => ({ ...prev, sections: updatedSections }));
  };

  const handleSectionContentChange = (index, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index].content = value;
    setFormData(prev => ({ ...prev, sections: updatedSections }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: '' }]
    }));
  };

  const removeSection = (index) => {
    const updatedSections = formData.sections.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, sections: updatedSections }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let updatedBlogs;
    if (editingBlog) {
      updatedBlogs = blogs.map(b => b.id === editingBlog.id ? { ...formData, id: b.id } : b);
      alert('Blog updated successfully!');
    } else {
      const newBlog = { ...formData, id: Date.now() };
      updatedBlogs = [...blogs, newBlog];
      alert('Blog added successfully!');
    }

    setBlogs(updatedBlogs);
    localStorage.setItem('cb_blogs', JSON.stringify(updatedBlogs));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: '',
      image: '',
      author: 'CureBasket Medical Team',
      date: new Date().toISOString().split('T')[0],
      readingTime: '5 min read',
      sections: [
        { title: 'Introduction', content: '' },
        { title: 'Causes', content: '' },
        { title: 'Symptoms', content: '' }
      ]
    });
    setIsAdding(false);
    setEditingBlog(null);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    // Support old object-based sections by converting them to array
    const sections = Array.isArray(blog.sections) 
      ? blog.sections 
      : Object.entries(blog.sections || {}).map(([title, content]) => ({ title, content }));
    
    setFormData({ ...blog, sections });
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      const updatedBlogs = blogs.filter(b => b.id !== id);
      setBlogs(updatedBlogs);
      localStorage.setItem('cb_blogs', JSON.stringify(updatedBlogs));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-500 text-sm">Manage your website's blog posts here.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Add New Blog
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{editingBlog ? 'Edit Blog' : 'Add New Blog'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Slug (URL) *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Image URL *</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  required
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-bold text-gray-900">Blog Sections</h4>
                <button
                  type="button"
                  onClick={addSection}
                  className="text-sm text-[#006D6D] font-bold hover:underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Add Section
                </button>
              </div>
              
              <div className="space-y-6">
                {formData.sections.map((section, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-[#006D6D] space-y-4">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3 w-full">
                        <span className="w-6 h-6 bg-[#006D6D]/10 text-[#006D6D] rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleSectionTitleChange(index, e.target.value)}
                          className="font-bold text-gray-800 bg-transparent border-b-2 border-dashed border-gray-200 focus:outline-none focus:border-[#006D6D] text-sm w-full py-1 transition-colors"
                          placeholder="Enter section title (e.g. Introduction)"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        title="Remove Section"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <textarea
                      value={section.content}
                      onChange={(e) => handleSectionContentChange(index, e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D] focus:bg-white transition-all"
                      rows="5"
                      placeholder={`Enter content for ${section.title || 'this section'}...`}
                      required
                    ></textarea>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] transition-colors"
              >
                {editingBlog ? 'Update Blog' : 'Save Blog'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Blog Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{blog.title}</td>
                  <td className="px-6 py-4">{blog.category}</td>
                  <td className="px-6 py-4">{blog.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-2 text-gray-500 hover:text-[#006D6D] hover:bg-[#E6F7F7] rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No blogs found. Add your first blog post!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Blogs;
