// frontend/src/components/PageManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PageManager = ({ apiUrl, dbCredentials }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  useEffect(() => {
    loadPages();
  }, [apiUrl, dbCredentials]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const response = await axios.post(apiUrl, {
        action: 'get_all_pages',
        host: dbCredentials.host,
        username: dbCredentials.username,
        password: dbCredentials.password,
        database: dbCredentials.database
      });
      
      if (response.data.status === 'success') {
        setPages(response.data.pages);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    }
    setLoading(false);
  };

  const createNewPage = () => {
    setEditingPage({
      page_name: '',
      page_slug: '',
      page_title: '',
      page_content: '',
      page_css: '',
      page_js: '',
      template_name: 'default',
      status: 'draft'
    });
    setShowEditor(true);
  };

  const editPage = (page) => {
    setEditingPage(page);
    setShowEditor(true);
  };

  const deletePage = async (pageId) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await axios.post(apiUrl, {
          action: 'delete_page',
          page_id: pageId,
          host: dbCredentials.host,
          username: dbCredentials.username,
          password: dbCredentials.password,
          database: dbCredentials.database
        });
        loadPages();
      } catch (error) {
        alert('Error deleting page');
      }
    }
  };

  const savePage = async (pageData) => {
    try {
      await axios.post(apiUrl, {
        action: 'save_page',
        page_data: pageData,
        host: dbCredentials.host,
        username: dbCredentials.username,
        password: dbCredentials.password,
        database: dbCredentials.database
      });
      setShowEditor(false);
      loadPages();
    } catch (error) {
      alert('Error saving page');
    }
  };

  if (showEditor) {
    return (
      <PageEditor 
        page={editingPage}
        onSave={savePage}
        onCancel={() => setShowEditor(false)}
      />
    );
  }

  return (
    <div className="page-manager">
      <div className="pages-header">
        <h2>Website Pages</h2>
        <button onClick={createNewPage} className="btn-create">
          + Create New Page
        </button>
      </div>
      
      {loading ? (
        <div>Loading pages...</div>
      ) : (
        <div className="pages-grid">
          {pages.map(page => (
            <div key={page.id} className="page-card">
              <h3>{page.page_name}</h3>
              <p><strong>Slug:</strong> /{page.page_slug}</p>
              <p><strong>Title:</strong> {page.page_title}</p>
              <p><strong>Status:</strong> 
                <span className={`status-${page.status}`}>{page.status}</span>
              </p>
              <div className="page-actions">
                <button onClick={() => editPage(page)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => deletePage(page.id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PageEditor = ({ page, onSave, onCancel }) => {
  const [pageData, setPageData] = useState(page || {
    page_name: '',
    page_slug: '',
    page_title: '',
    page_content: '',
    page_css: '',
    page_js: '',
    template_name: 'default',
    status: 'draft'
  });

  const handleInputChange = (e) => {
    setPageData({
      ...pageData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(pageData);
  };

  return (
    <div className="page-editor">
      <h2>{page?.id ? 'Edit Page' : 'Create New Page'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Page Name:</label>
          <input
            type="text"
            name="page_name"
            value={pageData.page_name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Page Slug:</label>
          <input
            type="text"
            name="page_slug"
            value={pageData.page_slug}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Page Title:</label>
          <input
            type="text"
            name="page_title"
            value={pageData.page_title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={pageData.status}
            onChange={handleInputChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Page Content (HTML):</label>
          <textarea
            name="page_content"
            value={pageData.page_content}
            onChange={handleInputChange}
            rows="10"
          />
        </div>
        
        <div className="form-group">
          <label>Custom CSS:</label>
          <textarea
            name="page_css"
            value={pageData.page_css}
            onChange={handleInputChange}
            rows="5"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-save">Save Page</button>
          <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default PageManager;
