import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="courses" element={<div className="text-slate-600">Trang Khóa học đang phát triển...</div>} />
          <Route path="settings" element={<div className="text-slate-600">Trang Cài đặt đang phát triển...</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
