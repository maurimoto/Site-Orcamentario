import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import Login from "@/react-app/pages/Login";
import Register from "@/react-app/pages/Register";
import ForgotPassword from "@/react-app/pages/ForgotPassword";
import ResetPassword from "@/react-app/pages/ResetPassword";
import Dashboard from "@/react-app/pages/Dashboard";
import Plans from "@/react-app/pages/Plans";
import NewQuote from "@/react-app/pages/NewQuote";
import ClientCalculator from "@/react-app/pages/client/ClientCalculator";
import ClientQuotes from "@/react-app/pages/client/ClientQuotes";
import ClientSubscription from "@/react-app/pages/client/ClientSubscription";
import AdminDashboard from "@/react-app/pages/admin/AdminDashboard";
import AdminClients from "@/react-app/pages/admin/AdminClients";
import AdminQuotes from "@/react-app/pages/admin/AdminQuotes";
import AdminRules from "@/react-app/pages/admin/AdminRules";
import AdminCalculator from "@/react-app/pages/admin/AdminCalculator";
import AdminRevenue from "@/react-app/pages/admin/AdminRevenue";
import PrivacyPolicy from "@/react-app/pages/PrivacyPolicy";
import TermsOfService from "@/react-app/pages/TermsOfService";
import PaymentSuccess from "@/react-app/pages/PaymentSuccess";
import PaymentFailure from "@/react-app/pages/PaymentFailure";
import PaymentPending from "@/react-app/pages/PaymentPending";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/new-quote" element={<NewQuote />} />
        <Route path="/client/calculator" element={<ClientCalculator />} />
        <Route path="/client/quotes" element={<ClientQuotes />} />
        <Route path="/client/subscription" element={<ClientSubscription />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/quotes" element={<AdminQuotes />} />
        <Route path="/admin/rules" element={<AdminRules />} />
        <Route path="/admin/calculator" element={<AdminCalculator />} />
        <Route path="/admin/revenue" element={<AdminRevenue />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />
        <Route path="/payment/pending" element={<PaymentPending />} />
      </Routes>
    </Router>
  );
}
