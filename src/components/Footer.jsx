import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      textAlign: 'center',
      padding: '1rem',
      marginTop: 'auto'
    }}>
      &copy; {new Date().getFullYear()} My Professional Site. All rights reserved.
    </footer>
  );
};

export default Footer;