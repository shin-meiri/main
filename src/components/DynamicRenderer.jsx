// frontend/src/components/DynamicRenderer.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const DynamicRenderer = ({ pageSlug }) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const loadDefaultData = useCallback(async (slug) => {
    try {
      setIsConnected(false);
      
      // Coba load pages
      let pages = [];
      try {
        const pagesResponse = await fetch('/default-data/pages.json');
        const pagesText = await pagesResponse.text();
        console.log('Pages JSON:', pagesText);
        pages = JSON.parse(pagesText);
      } catch (pagesError) {
        console.error('Pages JSON error details:', pagesError);
        throw new Error('Pages JSON invalid: ' + pagesError.message);
      }
      
      // Cari page
      let page = pages.find(p => p.page_slug === slug);
      if (!page) {
        page = pages.find(p => p.page_slug === 'home');
      }
      
      if (!page) {
        throw new Error('No default page found');
      }
      
      // Load templates
      let templates = [];
      try {
        const templatesResponse = await fetch('/default-data/templates.json');
        const templatesText = await templatesResponse.text();
        console.log('Templates JSON:', templatesText);
        templates = JSON.parse(templatesText);
      } catch (templatesError) {
        console.error('Templates JSON error:', templatesError);
        templates = [{
          header_html: '<!DOCTYPE html><html><head><title>{{page_title}}</title><style>{{template_css}}{{page_css}}{{custom_css}}</style></head><body><header><nav><a href="/">Home</a></nav></header><main>',
          footer_html: '</main><footer><p>&copy; 2024</p></footer></body></html>',
          template_css: 'body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }'
        }];
      }
      
      // Load settings
      let settings = {};
      try {
        const settingsResponse = await fetch('/default-data/settings.json');
        const settingsText = await settingsResponse.text();
        console.log('Settings JSON:', settingsText);
        settings = JSON.parse(settingsText);
      } catch (settingsError) {
        console.error('Settings JSON error:', settingsError);
        settings = {
          site_title: 'Default Site',
          custom_css: ''
        };
      }
      
      setPageData({
        ...page,
        header_html: templates[0]?.header_html || '',
        footer_html: templates[0]?.footer_html || '',
        template_css: templates[0]?.template_css || '',
        template_js: templates[0]?.template_js || '',
        settings: settings
      });
      
    } catch (error) {
      console.error('Failed to load default data:', error);
      setError('Default data error: ' + error.message);
    }
    
    setLoading(false);
  }, []);

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const defaultDbConfig = {
      host: 'localhost',
      username: 'root',
      password: '',
      database: 'cms_complete'
    };
    
    try {
      // Coba load saved connection
      let dbConfig = defaultDbConfig;
      try {
        const savedResponse = await axios.post('http://localhost:8000/api/konek.php', {
          action: 'get_current'
        });
        
        if (savedResponse.data.status === 'success' && savedResponse.data.current) {
          dbConfig = savedResponse.data.current;
        }
      } catch (savedError) {
        console.log('Using default connection');
      }
      
      // Coba koneksi ke database
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
          
          // Load page dari database
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
        console.log('Database not available, using default data');
      }
      
      // Fallback ke default data
      await loadDefaultData(pageSlug || 'home');
      
    } catch (err) {
      console.error('Load page error:', err);
      await loadDefaultData(pageSlug || 'home');
    }
  }, [pageSlug, loadDefaultData]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Loading page...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onclick="window.location.reload()">Retry</button>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>404 - Page Not Found</h2>
        <a href="/">Go Home</a>
      </div>
    );
  }

  // Render page
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

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: fullHtml }} />
      {isConnected && (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          right: 0, 
          background: '#4CAF50', 
          color: 'white', 
          padding: '5px 10px', 
          fontSize: '12px'
        }}>
          Connected
        </div>
      )}
    </div>
  );
};

export default DynamicRenderer;
