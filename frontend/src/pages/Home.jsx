import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Home Page</h1>
      <button onClick={() => { localStorage.removeItem("access_token"); navigate("/login"); }} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};
export default Home;
