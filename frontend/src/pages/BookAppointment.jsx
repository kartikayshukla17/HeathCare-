import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../context/AppointmentContext';
import { Search, Calendar, MapPin, User, ChevronRight, CheckCircle, CreditCard, DollarSign } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import api from '../api/axios';

const BookAppointment = () => {
    const navigate = useNavigate();
    const { fetchAppointments } = useAppointments();
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null); // { date: '2023-12-25', time: '09:00-11:00' }
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const response = await api.get('/specializations');
                setCategories(response.data.map(s => s.name));
            } catch (err) {
                console.error("Failed to fetch specializations", err);
            }
        };
        fetchSpecializations();
    }, []);

    // Fetch doctors when category changes
    useEffect(() => {
        if (selectedCategory) {
            const fetchDoctors = async () => {
                setLoading(true);
                try {
                    const response = await api.get(`/appointments/doctors?specialization=${selectedCategory}`);
                    setDoctors(response.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchDoctors();
        }
    }, [selectedCategory]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setStep(2);
    };

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(3);
    };

    const handleSlotSelect = (day, time) => {
        // Calculate next occurrence of this day
        // For Hackathon, let's just pick a dummy date for "Next [Day]"
        const today = new Date();
        // logic to find date string for the day name... omitted for brevity, using simplistic "Today/Tomorrow" or just passing string
        // Actually, we need a date. Let's assume the Day string implies the upcoming day of that week.
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = days.indexOf(day);
        const todayIndex = today.getDay();

        let daysUntil = dayIndex - todayIndex;
        if (daysUntil <= 0) daysUntil += 7; // Next occurrence

        const nextDate = new Date();
        nextDate.setDate(today.getDate() + daysUntil);
        const dateString = nextDate.toISOString().split('T')[0];

        setSelectedSlot({ date: dateString, time, day });
        setStep(4);
    };

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handlePayment = async () => {
        if (!paymentMethod) return;
        setLoading(true);
        setError('');

        try {
            if (paymentMethod === 'Cash') {
                await api.post('/appointments/book', {
                    doctorId: selectedDoctor._id,
                    date: selectedSlot.date,
                    time: selectedSlot.time,
                    symptoms: "Regular Checkup",
                    paymentMethod
                });
                await fetchAppointments();
                setStep(5);
                setTimeout(() => navigate('/'), 3000);
            } else if (paymentMethod === 'Razorpay') {
                const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

                if (!res) {
                    setError("Razorpay SDK failed to load. Are you online?");
                    setLoading(false);
                    return;
                }

                // 1. Create Order
                const orderRes = await api.post("/payment/order", { amount: 500 }); // Dummy amount 500 INR
                const { order } = orderRes.data;

                // 2. Open Notification
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder", // Enter the Key ID generated from the Dashboard
                    amount: order.amount,
                    currency: order.currency,
                    name: "MediCare Plus",
                    description: "Appointment Booking Fee",
                    image: "https://example.com/your_logo", // You can add your logo here
                    order_id: order.id,
                    handler: async function (response) {
                        // 3. Verify Payment
                        try {
                            const verifyRes = await api.post("/payment/verify", {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });

                            if (verifyRes.data.success) {
                                // 4. Book Appointment
                                await api.post('/appointments/book', {
                                    doctorId: selectedDoctor._id,
                                    date: selectedSlot.date,
                                    time: selectedSlot.time,
                                    symptoms: "Regular Checkup",
                                    paymentMethod: 'Razorpay',
                                    paymentId: response.razorpay_payment_id
                                });
                                await fetchAppointments();
                                setStep(5);
                                setTimeout(() => navigate('/'), 3000);
                            } else {
                                setError("Payment verification failed");
                            }
                        } catch (err) {
                            console.error(err);
                            setError("Payment verification failed on server");
                        }
                    },
                    prefill: {
                        name: "Kartikay Shukla", // We could fetch this from user profile
                        email: "kartikay@example.com",
                        contact: "9999999999",
                    },
                    notes: {
                        address: "Razorpay Corporate Office",
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        {step > 1 && (
                            <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
                                <ChevronRight className="rotate-180 text-gray-600 dark:text-gray-300" />
                            </button>
                        )}
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Book Appointment</h1>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Progress Bar */}
                <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-zinc-700 -z-10 -translate-y-1/2 rounded-full"></div>
                    {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-500'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {error && <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

                {/* STEP 1: Select Category */}
                {step === 1 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Select Specialization</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategorySelect(cat)}
                                    className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-center group"
                                >
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                        <ChevronRight />
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{cat}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: Select Doctor */}
                {step === 2 && (
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Select Doctor</h2>
                        </div>

                        {loading ? <p>Loading doctors...</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {doctors.map(doc => (
                                    <div key={doc._id} onClick={() => handleDoctorSelect(doc)} className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 hover:border-blue-500 cursor-pointer transition-all">
                                        <div className="flex items-center gap-4 mb-4">
                                            <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-full object-cover" />
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{doc.name}</h3>
                                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                                    {doc.specialization?.name || doc.specialization}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin size={16} />
                                            <span>Startups Valley, City</span>
                                        </div>
                                    </div>
                                ))}
                                {doctors.length === 0 && <p className="text-gray-500">No doctors found for this category.</p>}
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: Select Slot */}
                {step === 3 && selectedDoctor && (
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Select Time Slot</h2>
                        </div>

                        <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 mb-8">
                            <div className="flex items-center gap-6 mb-8">
                                <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-zinc-700" />
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDoctor.name}</h3>
                                    <p className="text-lg text-blue-600 dark:text-blue-400">
                                        {selectedDoctor.specialization?.name || selectedDoctor.specialization}
                                    </p>
                                </div>
                            </div>

                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Available Slots</h4>
                            <div className="space-y-4">
                                {selectedDoctor.availability.map((av, idx) => (
                                    <div key={idx}>
                                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">{av.day}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {av.slots.map(slot => (
                                                <button
                                                    key={slot}
                                                    onClick={() => handleSlotSelect(av.day, slot)}
                                                    className="px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: Payment */}
                {step === 4 && (
                    <div className="max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Payment Method</h2>

                        <div className="space-y-4">
                            <label className={`block p-6 rounded-2xl border transition-all duration-300 cursor-pointer group ${paymentMethod === 'Cash' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 ring-2 ring-blue-500/20' : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:border-blue-200 dark:hover:border-zinc-700 hover:shadow-lg'}`}>
                                <div className="flex items-center gap-5">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Cash"
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                                        <DollarSign size={28} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Pay at Clinic</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pay via cash or card after your consultation</p>
                                    </div>
                                </div>
                            </label>

                            <label className={`block p-6 rounded-2xl border transition-all duration-300 cursor-pointer group ${paymentMethod === 'Razorpay' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 ring-2 ring-blue-500/20' : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:border-blue-200 dark:hover:border-zinc-700 hover:shadow-lg'}`}>
                                <div className="flex items-center gap-5">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Razorpay"
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                        <CreditCard size={28} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Razorpay</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fast and secure online payment</p>
                                    </div>
                                </div>
                            </label>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={!paymentMethod || loading}
                            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : `Confirm Booking`}
                        </button>
                    </div>
                )}

                {/* STEP 5: Success */}
                {step === 5 && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Appointment Booked!</h2>
                        <p className="text-gray-500 dark:text-gray-400">Your appointment with {selectedDoctor?.name} is confirmed.</p>
                        <p className="text-sm text-gray-400 mt-8">Redirecting to Dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookAppointment;
