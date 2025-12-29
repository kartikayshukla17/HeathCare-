import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, Clock, Calendar } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import api from '../api/axios';

const DoctorProfileSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Availability State: Array of objects { day: 'Monday', slots: ['09:00-11:00'] }
    const [availability, setAvailability] = useState([
        { day: 'Monday', slots: ['09:00-12:00', '14:00-17:00'] },
        { day: 'Tuesday', slots: ['09:00-12:00'] },
        { day: 'Wednesday', slots: ['09:00-12:00', '14:00-17:00'] },
        { day: 'Thursday', slots: ['09:00-12:00'] },
        { day: 'Friday', slots: ['09:00-12:00', '14:00-16:00'] },
    ]);

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('availability', JSON.stringify(availability));
            if (image) {
                formData.append('image', image);
            }

            const response = await api.put('/doctor/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                navigate('/doctor/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    // Fetch existing profile to pre-fill
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/doctor/profile');
                if (response.data) {
                    if (response.data.availability && response.data.availability.length > 0) {
                        setAvailability(response.data.availability);
                    }
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

    const addDay = () => {
        setAvailability([...availability, { day: 'Monday', slots: ['09:00-17:00'] }]);
    };

    const removeDay = (index) => {
        const newAvailability = [...availability];
        newAvailability.splice(index, 1);
        setAvailability(newAvailability);
    };

    const updateDay = (index, value) => {
        const newAvailability = [...availability];
        newAvailability[index].day = value;
        setAvailability(newAvailability);
    };

    const updateSlot = (dayIndex, slotIndex, value) => {
        const newAvailability = [...availability];
        newAvailability[dayIndex].slots[slotIndex] = value;
        setAvailability(newAvailability);
    };

    const addSlot = (dayIndex) => {
        const newAvailability = [...availability];
        newAvailability[dayIndex].slots.push('09:00-10:00');
        setAvailability(newAvailability);
    };

    const removeSlot = (dayIndex, slotIndex) => {
        const newAvailability = [...availability];
        newAvailability[dayIndex].slots.splice(slotIndex, 1);
        setAvailability(newAvailability);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flexjustify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Setup</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Please set your availability to complete your profile.</p>
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

                <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            Weekly Schedule
                        </h2>
                        <button
                            onClick={addDay}
                            className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                            <Plus size={16} />
                            Add Day
                        </button>
                    </div>

                    {/* Image Upload */}
                    <div className="flex justify-center mb-8">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-400 text-center">
                                        <Plus className="w-8 h-8 mx-auto mb-1" />
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

                    <div className="space-y-6">
                        {availability.map((item, dayIndex) => (
                            <div key={dayIndex} className="p-4 bg-gray-50 dark:bg-zinc-700/50 rounded-xl border border-gray-100 dark:border-zinc-700">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">


                                    {/* Day Selector */}
                                    <div className="w-full sm:w-48">
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <select
                                                value={item.day}
                                                onChange={(e) => updateDay(dayIndex, e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                                            >
                                                {daysOfWeek.map(day => (
                                                    <option key={day} value={day}>{day}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Slots */}
                                    <div className="flex-1 space-y-3">
                                        {item.slots.map((slot, slotIndex) => (
                                            <div key={slotIndex} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={slot}
                                                    onChange={(e) => updateSlot(dayIndex, slotIndex, e.target.value)}
                                                    className="flex-1 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400"
                                                    placeholder="e.g. 09:00-12:00"
                                                />
                                                <button
                                                    onClick={() => removeSlot(dayIndex, slotIndex)}
                                                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addSlot(dayIndex)}
                                            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                        >
                                            <Plus size={12} />
                                            Add Time Slot
                                        </button>
                                    </div>

                                    {/* Remove Day Button */}
                                    <button
                                        onClick={() => removeDay(dayIndex)}
                                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors self-start"
                                        title="Remove Day"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all border border-transparent disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save size={20} />
                                Complete Setup
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfileSetup;
