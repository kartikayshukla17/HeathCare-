import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Calendar, Clock, LogOut, Plus, CreditCard, History, User, Settings } from 'lucide-react';
import AppointmentCalendar from '../components/AppointmentCalendar';
import { useAppointments } from '../context/AppointmentContext';
import ThemeToggle from '../components/ThemeToggle';
import api from '../api/axios';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { appointments: contextAppointments, fetchAppointments, loading: contextLoading } = useAppointments();
    const [patient, setPatient] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [imageError, setImageError] = useState(false);

    // Default empty structure to prevent errors if context hasn't loaded or is wrong type
    const appointments = contextAppointments.today ? contextAppointments : { today: [], upcoming: [], history: [] };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // 1. Fetch Profile
                const profileRes = await api.get('/patient/profile');
                const profile = profileRes.data;

                // Check if profile is complete
                if (!profile.bloodGroup || !profile.gender || !profile.DOB || !profile.address) {
                    navigate('/patient/setup');
                    return;
                }
                setPatient(profile);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setProfileLoading(false);
            }
        };

        fetchProfile();
        fetchAppointments(); // Ensure fresh data on dash load
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (profileLoading || contextLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Hello, <span className="font-semibold text-blue-600 dark:text-blue-400">{patient?.name}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                        <ThemeToggle />
                        <button
                            onClick={() => navigate('/patient/setup')}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                            title="Edit Profile"
                        >
                            <Settings size={24} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={24} />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-zinc-800 overflow-hidden border-2 border-white dark:border-zinc-700 shadow-sm flex items-center justify-center">
                            {patient?.image && !imageError ? (
                                <img
                                    src={patient.image}
                                    alt={patient.name}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                                    {patient?.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Today's Appointments Section */}
                        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                            <h2 className="text-xl font-bold mb-4 relative z-10">Today's Schedule</h2>
                            {appointments.today.length > 0 ? (
                                <div className="space-y-4 relative z-10">
                                    {appointments.today.map(appt => (
                                        <div key={appt.id} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between border border-white/10">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white/20 p-2 rounded-lg">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{appt.doctorName}</h3>
                                                    <p className="text-blue-100 text-sm">{appt.type}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-xl">{appt.time}</p>
                                                <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">{appt.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-blue-100 relative z-10">No appointments scheduled for today.</p>
                            )}
                        </div>

                        {/* Tabs for Upcoming / History */}
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden">
                            <div className="flex border-b border-gray-100 dark:border-zinc-700">
                                <button
                                    onClick={() => setActiveTab('upcoming')}
                                    className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700/50'}`}
                                >
                                    Upcoming Appointments
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700/50'}`}
                                >
                                    History
                                </button>
                                <button
                                    onClick={() => setActiveTab('calendar')}
                                    className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${activeTab === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700/50'}`}
                                >
                                    Calendar
                                </button>
                            </div>

                            <div className="p-6 min-h-[300px]">
                                {activeTab === 'upcoming' && (
                                    <div className="space-y-4">
                                        {appointments.upcoming.length > 0 ? appointments.upcoming.map(appt => (
                                            <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-700/30 rounded-xl border border-gray-100 dark:border-zinc-700/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-zinc-700 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                        Dr
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">{appt.doctorName}</h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{appt.type} • {appt.date}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900 dark:text-white">{appt.time}</p>
                                                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">{appt.status}</span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-10 text-gray-500">No upcoming appointments.</div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'history' && (
                                    <div className="space-y-4">
                                        {appointments.history.length > 0 ? appointments.history.map(appt => (
                                            <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-700/30 rounded-xl border border-gray-100 dark:border-zinc-700/50 opacity-75">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-500 font-bold">
                                                        Dr
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">{appt.doctorName}</h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{appt.type} • {appt.date}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Completed</span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-10 text-gray-500">No history available.</div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'calendar' && (
                                    <AppointmentCalendar
                                        appointments={[...appointments.today, ...appointments.upcoming, ...appointments.history]}
                                        userRole="patient"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Quick Actions */}
                    <div className="space-y-6">
                        {/* Book New Appointment */}
                        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 text-center">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                                <Plus size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Need a Doctor?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Book a new appointment with our specialists.</p>
                            <button
                                onClick={() => navigate('/patient/book-appointment')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all"
                            >
                                Book Appointment
                            </button>
                        </div>

                        {/* Quick Tips or Info Card (Replaces Razorpay Placeholder) */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-600/20 text-white">
                            <h3 className="font-bold text-lg mb-2">Health Tip</h3>
                            <p className="text-blue-50 text-sm leading-relaxed">
                                Regular checkups can help detect issues early. Schedule your visit today for a healthier tomorrow.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
