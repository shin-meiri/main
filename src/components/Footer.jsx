function Footer() {
  return (
    <footer style={styles.footer}>
      <p>&copy; 2025 SecureApp. Hak Cipta Dilindungi.</p>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '15px',
    marginTop: 'auto',
    fontSize: '14px',
  },
};

export default Footer;