// frontend/src/components/DynamicPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DynamicPage = ({ apiUrl, dbCredentials, pageSlug }) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        // Load default template and page
        const templateHtml = '<div class="page-container"><h1>{{page_title}}</h1><div class="page-content">{{page_content}}</div></div>';
        const templateCss = '.page-container { max-width: 800px; margin: 0 auto; padding: 20px; } .page-content { line-height: 1.6; }';
        
        // Load page data
        const pageResponse = await axios.post(apiUrl, {
          action: 'get_page',
          slug: pageSlug || 'home',
          host: dbCredentials.host,
          username: dbCredentials.username,
          password: dbCredentials.password,
          database: dbCredentials.database
        });
        
        if (pageResponse.data.status === 'success' && pageResponse.data.page) {
          setPageData({
            ...pageResponse.data.page,
            template_html: templateHtml,
            template_css: templateCss
          });
        } else {
          // Load home page if slug not found
          const homeResponse = await axios.post(apiUrl, {
            action: 'get_page',
            slug: 'home',
            host: dbCredentials.host,
            username: dbCredentials.username,
            password: dbCredentials.password,
            database: dbCredentials.database
          });
          
          if (homeResponse.data.status === 'success' && homeResponse.data.page) {
            setPageData({
              ...homeResponse.data.page,
              template_html: templateHtml,
              template_css: templateCss
            });
          }
        }
      } catch (error) {
        console.error('Error loading page:', error);
      }
      setLoading(false);
    };
    
    loadPage();
  }, [apiUrl, dbCredentials, pageSlug]);

  if (loading) {
    return <div>Loading page...</div>;
  }

  if (!pageData) {
    return <div>Page not found</div>;
  }

  // Render page
  let pageHtml = pageData.template_html || '<div>{{page_content}}</div>';
  pageHtml = pageHtml
    .replace('{{page_title}}', pageData.page_title || '')
    .replace('{{page_content}}', pageData.page_content || '');
  
  const pageCss = `
    ${pageData.template_css || ''}
    ${pageData.page_css || ''}
  `;

  return (
    <div className="dynamic-page">
      <style>{pageCss}</style>
      <div dangerouslySetInnerHTML={{ __html: pageHtml }} />
    </div>
  );
};

export default DynamicPage;