import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // Backend URL is provided via Vite env var `VITE_BACKEND_URL`.
  // Create `frontend/.env` (ignored) or set env in your deployment.
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        // Updated the URL to use the dynamic backend address
        const response = await axios.post(`${BACKEND_URL}/api/auth/google/`, {
          code: codeResponse.code,
        });
        
        localStorage.setItem('access_token', response.data.key);
        navigate('/');
      } catch (error) {
        console.error("Login Failed:", error);
        // Better error logging for debugging
        if (error.response) {
            console.error("Backend Error Data:", error.response.data);
        }
        alert("Login failed! Check console for details.");
      }
    },
    onError: errorResponse => console.log("Google Error:", errorResponse),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome</h1>
        <button
          onClick={() => googleLogin()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;