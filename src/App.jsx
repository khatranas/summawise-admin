import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/layouts";
import { RecoilRoot } from "recoil";
import { SignIn } from "./pages/auth";

function App() {
  return (
    <RecoilRoot>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        {/* <Route path="/auth/*" element={<Auth />} /> */}
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
        <Route path="/auth/login/" element={<SignIn />} />
      </Routes>
    </RecoilRoot>

  );
}

export default App;
