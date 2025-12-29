import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProfileSetup from "./pages/DoctorProfileSetup";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProfileSetup from "./pages/PatientProfileSetup";
import BookAppointment from "./pages/BookAppointment";
import { AppointmentProvider } from "./context/AppointmentContext";

function App() {
  return (
    <BrowserRouter>
      <AppointmentProvider>
        <div className="font-sans antialiased text-gray-900 dark:text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Patient Routes */}
            {/* Patient Routes */}
            <Route path="/" element={
              <PrivateRoute restrictedRole="patient">
                <PatientDashboard />
              </PrivateRoute>
            } />

            <Route path="/patient/setup" element={
              <PrivateRoute restrictedRole="patient">
                <PatientProfileSetup />
              </PrivateRoute>
            } />

            <Route path="/patient/book-appointment" element={
              <PrivateRoute restrictedRole="patient">
                <BookAppointment />
              </PrivateRoute>
            } />

            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={
              <PrivateRoute restrictedRole="doctor">
                <DoctorDashboard />
              </PrivateRoute>
            } />

            <Route path="/doctor/setup" element={
              <PrivateRoute restrictedRole="doctor">
                <DoctorProfileSetup />
              </PrivateRoute>
            } />

          </Routes>
        </div>
      </AppointmentProvider>
    </BrowserRouter>
  );
}

export default App;
