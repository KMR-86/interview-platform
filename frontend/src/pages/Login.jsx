import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/google/', {
          code: codeResponse.code,
        });
        localStorage.setItem('access_token', response.data.key);
        navigate('/');
      } catch (error) {
        console.error("Login Failed:", error);
        alert("Login failed!");
      }
    },
    onError: errorResponse => console.log(errorResponse),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome</h1>
        <button
          onClick={() => googleLogin()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
