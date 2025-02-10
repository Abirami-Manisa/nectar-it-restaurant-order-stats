import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <div className="flex h-screen bg-color5">
      <Sidebar />
      <div className="flex flex-col flex-grow h-full overflow-hidden">
        <Navbar />

        <div className="flex-grow p-4 overflow-auto">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default App;
