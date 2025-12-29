import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, MapPin, Calendar, Droplet } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import api from '../api/axios';

const PatientProfileSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        bloodGroup: '',
        gender: '',
        DOB: '',
        address: ''
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Fetch existing profile to pre-fill
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/patient/profile');
                if (response.data) {
                    // Pre-fill form (ensure we handle missing fields gracefully)
                    setFormData({
                        bloodGroup: response.data.bloodGroup || '',
                        gender: response.data.gender || '',
                        DOB: response.data.DOB ? response.data.DOB.split('T')[0] : '', // Format Date for input
                        address: response.data.address || ''
                    });
                    if (response.data.image) {
                        setImagePreview(response.data.image);
                    }
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.bloodGroup || !formData.gender || !formData.DOB || !formData.address) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append('bloodGroup', formData.bloodGroup);
            data.append('gender', formData.gender);
            data.append('DOB', formData.DOB);
            data.append('address', formData.address);
            if (image) {
                data.append('image', image);
            }

            const response = await api.put('/patient/profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                navigate('/'); // Redirect to dashboard
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300 p-8 flex items-center justify-center">
            <div className="max-w-xl w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complete Profile</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">We need a few more details to get you started.</p>
                    </div>
                    <div className="absolute top-6 right-6">
                        <ThemeToggle />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 p-8">
                    <form onSubmit={handleSave} className="space-y-6">

                        {/* Image Upload */}
                        <div className="flex justify-center mb-6">
                            <div className="relative group cursor-pointer">
                                <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-gray-400 text-center">
                                            <User size={32} className="mx-auto mb-1" />
                                            <span className="text-xs">Upload Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Blood Group */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Blood Group</label>
                            <div className="relative">
                                <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="date"
                                    name="DOB"
                                    value={formData.DOB}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                                    placeholder="Enter your full address"
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save size={20} />
                                    Save Profile
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientProfileSetup;
