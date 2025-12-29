import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Stethoscope } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import api from '../api/axios';

const Signup = () => {
    const [role, setRole] = useState('patient');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: 'male',
        DOB: '',
        address: '',
        specialization: '',
    });
    const [specializations, setSpecializations] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch specializations
    useEffect(() => {
        const fetchSpecs = async () => {
            try {
                const response = await api.get('/specializations');
                setSpecializations(response.data.map(s => s.name));
            } catch (err) {
                console.error("Failed to fetch specializations", err);
            }
        };
        fetchSpecs();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await api.post('/auth/register', {
                ...formData,
                role: role,
            });

            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900">
                <img
                    src={role === 'doctor'
                        ? "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1950&q=80"
                        : "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    }
                    alt="Medical"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                <div className="relative z-10 p-12 flex flex-col justify-end text-white">
                    <h1 className="text-4xl font-bold mb-4">Join MediCare+</h1>
                    <p className="text-lg text-gray-300">
                        {role === 'doctor'
                            ? "Expand your practice and connect with patients seamlessly."
                            : "Your health journey starts here. Secure, fast, and reliable."}
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 relative py-12 overflow-y-auto">
                <div className="absolute top-6 right-6">
                    <ThemeToggle />
                </div>

                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Stethoscope className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">MediCare+</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
                            <p className="text-gray-500 dark:text-gray-400">Join our community.</p>
                        </div>

                        {/* Role Dropdown */}
                        <div className="relative">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="appearance-none bg-blue-50 dark:bg-zinc-800 border-2 border-blue-100 dark:border-zinc-700 text-blue-900 dark:text-blue-100 py-2 px-4 pr-8 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-700 dark:text-blue-300">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder={role === 'doctor' ? "Dr. John Doe" : "John Doe"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="name@example.com"
                        />
                    </div>

                    {/* Conditional Fields based on Role */}
                    {role === 'patient' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="DOB"
                                        required
                                        value={formData.DOB}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
                                <textarea
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                                    placeholder="123 Main St, City"
                                ></textarea>
                            </div>
                        </>
                    )}

                    {role === 'doctor' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Specialization</label>
                                    <div className="space-y-2">
                                        <select
                                            value={specializations.includes(formData.specialization) ? formData.specialization : (formData.specialization ? "Other" : "")}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === "Other") {
                                                    setFormData({ ...formData, specialization: "" });
                                                } else {
                                                    setFormData({ ...formData, specialization: val });
                                                }
                                            }}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                                        >
                                            <option value="" disabled>Select Specialization</option>
                                            {specializations.map(spec => (
                                                <option key={spec} value={spec}>{spec}</option>
                                            ))}
                                            <option value="Other">Other (Add New)</option>
                                        </select>

                                        {/* Show input if "Other" is selected */}
                                        {(!specializations.includes(formData.specialization) && formData.specialization !== undefined) && (
                                            <input
                                                type="text"
                                                name="specialization"
                                                required
                                                value={formData.specialization}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                                placeholder="Type your specialization..."
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.98] mt-2"
                    >
                        Create {role === 'doctor' ? 'Doctor' : 'Patient'} Account
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-500 font-semibold hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
