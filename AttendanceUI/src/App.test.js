import { render } from '@testing-library/react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
// :point_down:️ wrap component that uses useNavigate in Router
test('renders react component', async () => {
  render(
    <Router>
      <App />
    </Router>,
  );
  // your tests...
});
