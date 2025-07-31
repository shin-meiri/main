import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/');
    }
  }, [navigate]);

  return children;
}

export default PrivateRoute;