// frontend/src/components/DynamicRenderer.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const DynamicRenderer = ({ pageSlug }) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Default database configuration - menggunakan useCallback
  const getDefaultDbConfig = useCallback(() => ({
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'cms_complete'
  }), []);

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to load saved connection
      let dbConfig = getDefaultDbConfig();
      try {
        const savedResponse = await axios.post('http://localhost:8000/api/konek.php', {
          action: 'get_current'
        });
        
        if (savedResponse.data.status === 'success' && savedResponse.data.current) {
          dbConfig = savedResponse.data.current;
        }
      } catch (savedError) {
        console.log('No saved connection found, using defaults');
      }
      
      // Try to connect to database
      try {
        const testResponse = await axios.post('http://localhost:8000/api/konek.php', {
          action: 'test_connection',
          host: dbConfig.host,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database
        });
        
        if (testResponse.data.status === 'success') {
          setIsConnected(true);
          
          // Load page from database
          const pageResponse = await axios.post('http://localhost:8000/api/konek.php', {
            action: 'get_page',
            slug: pageSlug || 'home',
            host: dbConfig.host,
            username: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database
          });
          
          if (pageResponse.data.status === 'success' && pageResponse.data.page) {
            setPageData({
              ...pageResponse.data.page,
              settings: pageResponse.data.settings || {}
            });
            setLoading(false);
            return;
          }
        }
      } catch (dbError) {
        console.log('Database connection failed, using default data');
      }
      
      // Fallback to default data
      await loadDefaultData(pageSlug || 'home');
      
    } catch (err) {
      setError('Failed to load page: ' + err.message);
      setLoading(false);
    }
  }, [pageSlug, getDefaultDbConfig]);

  const loadDefaultData = useCallback(async (slug) => {
    try {
      setIsConnected(false);
      
      // Load pages from JSON
      const pagesResponse = await fetch('/default-data/pages.json');
      const pages = await pagesResponse.json();
      
      // Find page by slug
      let page = pages.find(p => p.page_slug === slug);
      if (!page) {
        page = pages.find(p => p.page_slug === 'home');
      }
      
      if (page) {
        // Load templates from JSON
        const templatesResponse = await fetch('/default-data/templates.json');
        const templates = await templatesResponse.json();
        
        // Load settings from JSON
        const settingsResponse = await fetch('/default-data/settings.json');
        const settings = await settingsResponse.json();
        
        setPageData({
          ...page,
          header_html: templates[0]?.header_html || '',
          footer_html: templates[0]?.footer_html || '',
          template_css: templates[0]?.template_css || '',
          template_js: templates[0]?.template_js || '',
          settings: settings || {}
        });
      }
    } catch (error) {
      setError('Failed to load default data: ' + error.message);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading page...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '50px',
        color: '#dc3545'
      }}>
        <h2>Error</h2>
        <p>{error}</p>
        <a href="/" style={{ color: '#007bff' }}>Go Home</a>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '50px'
      }}>
        <h2>404 - Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/" style={{ color: '#007bff' }}>Go Home</a>
      </div>
    );
  }

  // Render complete page with header, content, and footer
  let fullHtml = '';
  
  if (pageData.header_html) {
    fullHtml += pageData.header_html
      .replace('{{page_title}}', pageData.page_title || 'Untitled')
      .replace('{{template_css}}', pageData.template_css || '')
      .replace('{{page_css}}', pageData.page_css || '')
      .replace('{{custom_css}}', pageData.settings?.custom_css || '');
  }
  
  fullHtml += pageData.page_content || '';
  
  if (pageData.footer_html) {
    fullHtml += pageData.footer_html;
  }
  
  // Add JavaScript if any
  let fullJs = '';
  if (pageData.template_js) {
    fullJs += pageData.template_js;
  }
  if (pageData.page_js) {
    fullJs += pageData.page_js;
  }

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: fullHtml }} />
      {fullJs && (
        <script dangerouslySetInnerHTML={{ __html: fullJs }} />
      )}
      {isConnected && (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          right: 0, 
          background: '#4CAF50', 
          color: 'white', 
          padding: '5px 10px', 
          fontSize: '12px',
          zIndex: 1000
        }}>
          <small>✓ Connected to database</small>
        </div>
      )}
      {!isConnected && (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          right: 0, 
          background: '#ff9800', 
          color: 'white', 
          padding: '5px 10px', 
          fontSize: '12px',
          zIndex: 1000
        }}>
          <small>⚠ Using default data</small>
        </div>
      )}
    </div>
  );
};

export default DynamicRenderer;
