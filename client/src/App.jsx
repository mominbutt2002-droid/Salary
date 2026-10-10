import { BrowserRouter, Route, Routes } from "react-router-dom";
import Shell from "./components/Shell";
import Cards from "./pages/Cards";
import GoPay from "./pages/GoPay";
import History from "./pages/History";
import Home from "./pages/Home";
import Pay from "./pages/Pay";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import Transfer from "./pages/Transfer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="payments" element={<Payments />} />
          <Route path="pay/:serviceId" element={<Pay />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path="go" element={<GoPay />} />
          <Route path="cards" element={<Cards />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
