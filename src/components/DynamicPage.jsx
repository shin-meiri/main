// frontend/src/components/DynamicPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DynamicPage = ({ apiUrl, dbCredentials, pageSlug }) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      const slug = pageSlug || 'home';
      
      try {
        // Coba load dari database jika terhubung
        if (dbCredentials.host && dbCredentials.username && apiUrl) {
          try {
            // Test koneksi dulu
            const testResponse = await axios.post(apiUrl, {
              action: 'test_connection',
              host: dbCredentials.host,
              username: dbCredentials.username,
              password: dbCredentials.password,
              database: dbCredentials.database
            });
            
            if (testResponse.data.status === 'success') {
              setIsConnected(true);
              
              // Load page dari database
              const pageResponse = await axios.post(apiUrl, {
                action: 'get_page',
                slug: slug,
                host: dbCredentials.host,
                username: dbCredentials.username,
                password: dbCredentials.password,
                database: dbCredentials.database
              });
              
              if (pageResponse.data.status === 'success' && pageResponse.data.page) {
                // Load template
                const templateResponse = await axios.post(apiUrl, {
                  action: 'get_template',
                  template_name: pageResponse.data.page.template_name || 'default',
                  host: dbCredentials.host,
                  username: dbCredentials.username,
                  password: dbCredentials.password,
                  database: dbCredentials.database
                });
                
                if (templateResponse.data.status === 'success' && templateResponse.data.template) {
                  setPageData({
                    ...pageResponse.data.page,
                    template_html: templateResponse.data.template.template_html,
                    template_css: templateResponse.data.template.template_css,
                    page_css: pageResponse.data.page.page_css || '',
                    template_js: templateResponse.data.template.template_js
                  });
                } else {
                  // Fallback ke template default
                  setPageData({
                    ...pageResponse.data.page,
                    template_html: '<div class="page-container"><h1>{{page_title}}</h1><div class="page-content">{{page_content}}</div></div>',
                    template_css: '.page-container { max-width: 800px; margin: 0 auto; padding: 20px; } .page-content { line-height: 1.6; }',
                    page_css: pageResponse.data.page.page_css || ''
                  });
                }
                setLoading(false);
                return;
              }
            }
          } catch (dbError) {
            console.log('Database connection failed, using default data');
          }
        }
        
        // Fallback ke default data jika tidak terhubung
        setIsConnected(false);
        await loadDefaultData(slug);
        
      } catch (error) {
        console.error('Error loading page:', error);
        // Fallback ke default data
        await loadDefaultData(slug);
      }
    };
    
    loadPage();
  }, [apiUrl, dbCredentials, pageSlug]);

  const loadDefaultData = async (slug) => {
    try {
      // Load pages dari JSON
      const pagesResponse = await fetch('/default-data/pages.json');
      const pages = await pagesResponse.json();
      
      // Cari page berdasarkan slug
      let page = pages.find(p => p.page_slug === slug);
      
      // Jika tidak ditemukan, load home page
      if (!page) {
        page = pages.find(p => p.page_slug === 'home');
      }
      
      if (page) {
        // Load templates dari JSON
        const templatesResponse = await fetch('/default-data/templates.json');
        const templates = await templatesResponse.json();
        
        // Cari template
        const template = templates.find(t => t.template_name === (page.template_name || 'default')) || 
                        templates.find(t => t.template_name === 'default');
        
        // Load settings
        const settingsResponse = await fetch('/default-data/settings.json');
        const settings = await settingsResponse.json();
        
        setPageData({
          ...page,
          template_html: template?.template_html || '<div class="page-container"><h1>{{page_title}}</h1><div class="page-content">{{page_content}}</div></div>',
          template_css: template?.template_css || '.page-container { max-width: 800px; margin: 0 auto; padding: 20px; } .page-content { line-height: 1.6; }',
          page_css: page.page_css || '',
          custom_css: settings.custom_css || ''
        });
      }
    } catch (error) {
      console.error('Error loading default ', error);
      // Fallback sangat dasar
      setPageData({
        page_title: 'Welcome',
        page_content: '<p>Default page content</p>',
        template_html: '<div class="page-container"><h1>{{page_title}}</h1><div class="page-content">{{page_content}}</div></div>',
        template_css: '.page-container { max-width: 800px; margin: 0 auto; padding: 20px; } .page-content { line-height: 1.6; }',
        page_css: '',
        custom_css: ''
      });
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading page...</div>;
  }

  if (!pageData) {
    return (
      <div className="page-not-found">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/">Go to Home</a>
      </div>
    );
  }

  // Render page
  let pageHtml = pageData.template_html || '<div>{{page_content}}</div>';
  pageHtml = pageHtml
    .replace('{{page_title}}', pageData.page_title || '')
    .replace('{{page_content}}', pageData.page_content || '');
  
  // Gabungkan semua CSS
  const combinedCss = `
    ${pageData.custom_css || ''}
    ${pageData.template_css || ''}
    ${pageData.page_css || ''}
  `;

  return (
    <div className="dynamic-page">
      <style>{combinedCss}</style>
      <div dangerouslySetInnerHTML={{ __html: pageHtml }} />
      {isConnected && (
        <div className="connection-status" style={{ position: 'fixed', bottom: 0, right: 0, background: '#4CAF50', color: 'white', padding: '5px 10px', fontSize: '12px' }}>
          <small>Connected to database</small>
        </div>
      )}
      {!isConnected && (
        <div className="connection-status" style={{ position: 'fixed', bottom: 0, right: 0, background: '#ff9800', color: 'white', padding: '5px 10px', fontSize: '12px' }}>
          <small>Using default data - <a href="/admin" style={{ color: 'white', textDecoration: 'underline' }}>Connect to database</a></small>
        </div>
      )}
    </div>
  );
};

export default DynamicPage;