
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Calendar, Droplets, Heart, Activity, Plus, LogOut, Minus, User } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { HealthMetricCard, AppointmentCard, ActionButton } from '../components/DashboardWidgets';
import { fetchAppointments, selectNextAppointment } from "../redux/slices/appointmentSlice";
import { fetchTodayWater, addWater } from "../redux/slices/waterSlice";
import { logoutUser, updateUser } from "../redux/slices/authSlice";
import api from '../api/axios';

const PatientDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector(state => state.appointments);

    // Select next valid appointment (ignores cancelled)
    const nextAppointment = useSelector(selectNextAppointment);
    const { intakeAmount, dailyGoal } = useSelector((state) => state.water);
    const { upcoming, history } = useSelector((state) => state.appointments.patientData);

    useEffect(() => {
        dispatch(fetchAppointments());
        dispatch(fetchTodayWater());

        // Fetch latest profile to ensure image is displayed
        const loadProfile = async () => {
            try {
                const { data } = await api.get('/patient/profile');
                if (data) {
                    dispatch(updateUser(data));
                }
            } catch (err) {
                console.error("Failed to sync profile image", err);
            }
        };
        loadProfile();
    }, [dispatch]);

    const handleAddWater = () => {
        dispatch(addWater(250)); // Add 1 glass
    };

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors p-4 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Hello, {user?.name || 'Patient'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Here's your daily health overview.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={() => navigate('/patient/setup')}
                            className="relative rounded-full overflow-hidden border border-transparent hover:border-blue-500 transition-all"
                            title="Edit Profile"
                        >
                            {user?.image ? (
                                <img src={user.image} alt="Profile" className="w-10 h-10 object-cover" />
                            ) : (
                                <div className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                                    <User size={24} />
                                </div>
                            )}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={24} />
                        </button>
                    </div>
                </div>

                {/* Hero Section: Vitals & Next Appointment */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 relative overflow-hidden group hover:border-blue-500 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Hydration</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Daily Goal: {(dailyGoal / 1000).toFixed(1)}L</p>

                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{(intakeAmount / 1000).toFixed(2)}</span>
                                    <span className="text-gray-500 dark:text-gray-400 mb-1">Liters</span>
                                </div>
                                <p className="text-xs text-gray-400">{Math.round(intakeAmount / 250)} / {Math.round(dailyGoal / 250)} Glasses</p>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <div className="relative w-20 h-20">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-gray-100 dark:text-zinc-700"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                        <path
                                            className="text-blue-500 transition-all duration-500 ease-out"
                                            strokeDasharray={`${Math.min((intakeAmount / dailyGoal) * 100, 100)}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Droplets size={24} />
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddWater}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                                    title="Add 1 Glass (250ml)"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Next Appointment Card */}
                    <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Next Appointment</h2>
                        {nextAppointment ? (
                            <AppointmentCard
                                doctorName={nextAppointment.doctorName ? `Dr. ${nextAppointment.doctorName}` : "Dr. Unnamed"}
                                specialty={nextAppointment.type || "Specialist"}
                                date={new Date(nextAppointment.date).toDateString()}
                                time={nextAppointment.time}
                                onClick={() => navigate('/appointments')}
                            />
                        ) : (
                            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-zinc-700 h-64 flex flex-col items-center justify-center gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full">
                                    <Calendar size={32} className="text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Upcoming Visits</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">Schedule a checkup to stay on top of your health.</p>
                                </div>
                                <button
                                    onClick={() => navigate('/book-appointment')}
                                    className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Book Now
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quick Vitals */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Vitals Status</h2>
                        <HealthMetricCard
                            title="Heart Rate"
                            value="72"
                            unit="bpm"
                            icon={Heart}
                            color="bg-red-500"
                            trend={2}
                        />
                        <HealthMetricCard
                            title="Sugar Level"
                            value="98"
                            unit="mg/dL"
                            icon={Activity}
                            color="bg-purple-500"
                            trend={-5}
                        />
                    </div>

                    {/* Quick Actions - Moved to fill empty space */}
                    <div className="lg:col-span-2 h-full flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <ActionButton
                                icon={Plus}
                                label="Book Appointment"
                                onClick={() => navigate('/book-appointment')}
                                colorClass="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 h-full justify-center"
                            />
                            <ActionButton
                                icon={Calendar}
                                label="My Appointments"
                                onClick={() => navigate('/appointments')}
                                colorClass="h-full justify-center"
                            />
                            <ActionButton
                                icon={Droplets}
                                label="Log Water Info"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                colorClass="h-full justify-center"
                            />
                            <ActionButton
                                icon={Activity}
                                label="Health History"
                                onClick={() => navigate('/history')}
                                colorClass="h-full justify-center"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
