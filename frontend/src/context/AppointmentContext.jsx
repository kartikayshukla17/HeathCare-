import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AppointmentContext = createContext();

export const useAppointments = () => {
    return useContext(AppointmentContext);
};

export const AppointmentProvider = ({ children }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setLoading(false);
                return;
            }
            const user = JSON.parse(userStr);

            let endpoint = '';
            if (user.role === 'doctor') {
                endpoint = '/doctor/appointments';
            } else if (user.role === 'patient') {
                endpoint = '/patient/appointments';
            }

            if (endpoint) {
                const response = await api.get(endpoint);
                // Standardize data structure if different
                // Patient API returns object { today: [], upcoming: [], history: [] }
                // Doctor API returns array [ ... ]

                // For simplicity, we store raw data and let components parse, 
                // OR we standardize here. 
                // Let's store raw data in a flexible way.

                setAppointments(response.data);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const value = {
        appointments,
        loading,
        fetchAppointments
    };

    return (
        <AppointmentContext.Provider value={value}>
            {children}
        </AppointmentContext.Provider>
    );
};
