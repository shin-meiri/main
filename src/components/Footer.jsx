import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Nama Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '1rem 0',
  marginTop: 'auto',
};

export default Footer;