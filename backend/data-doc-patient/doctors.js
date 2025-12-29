export const doctors = [
  {
    id: 1,
    name: "Dr. Aarav Mehta",
    gender: "Male",
    specialization: "Cardiology",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    availability: [
      { day: "Monday", slots: ["09:00-11:00", "11:30-13:30"] },
      { day: "Thursday", slots: ["10:00-12:00", "14:00-16:00"] }
    ]
  },
  {
    id: 2,
    name: "Dr. Ananya Sharma",
    gender: "Female",
    specialization: "Dermatology",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
    availability: [
      { day: "Tuesday", slots: ["09:00-11:00", "11:30-13:30"] },
      { day: "Friday", slots: ["10:00-12:00", "14:00-16:00"] }
    ]
  },
  {
    id: 3,
    name: "Dr. Rohan Verma",
    gender: "Male",
    specialization: "Orthopedics",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    availability: [
      { day: "Wednesday", slots: ["09:00-11:00", "11:30-13:30"] },
      { day: "Saturday", slots: ["10:00-12:00", "14:00-16:00"] }
    ]
  },
  {
    id: 4,
    name: "Dr. Priya Kapoor",
    gender: "Female",
    specialization: "Gynecology",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
    availability: [
      { day: "Monday", slots: ["10:00-12:00", "14:00-16:00"] },
      { day: "Sunday", slots: ["09:00-11:00"] }
    ]
  },
  {
    id: 5,
    name: "Dr. Kunal Singh",
    gender: "Male",
    specialization: "Neurology",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    availability: [
      { day: "Tuesday", slots: ["10:00-12:00", "14:00-16:00"] },
      { day: "Thursday", slots: ["09:00-11:00"] }
    ]
  },
  {
    id: 6,
    name: "Dr. Neha Malhotra",
    gender: "Female",
    specialization: "Psychiatry",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
    availability: [
      { day: "Wednesday", slots: ["10:00-12:00", "14:00-16:00"] },
      { day: "Friday", slots: ["09:00-11:00"] }
    ]
  },
  {
    id: 7,
    name: "Dr. Aditya Rao",
    gender: "Male",
    specialization: "Pediatrics",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    availability: [
      { day: "Thursday", slots: ["10:00-12:00", "14:00-16:00"] },
      { day: "Saturday", slots: ["09:00-11:00"] }
    ]
  },
  {
    id: 8,
    name: "Dr. Sneha Iyer",
    gender: "Female",
    specialization: "ENT",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
    availability: [
      { day: "Friday", slots: ["10:00-12:00", "14:00-16:00"] },
      { day: "Sunday", slots: ["11:00-13:00"] }
    ]
  },
  {
    id: 9,
    name: "Dr. Vikram Joshi",
    gender: "Male",
    specialization: "General Surgery",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    availability: [
      { day: "Monday", slots: ["09:00-11:00"] },
      { day: "Wednesday", slots: ["14:00-16:00"] }
    ]
  },
  {
    id: 10,
    name: "Dr. Pooja Nair",
    gender: "Female",
    specialization: "Endocrinology",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
    availability: [
      { day: "Tuesday", slots: ["14:00-16:00"] },
      { day: "Saturday", slots: ["10:00-12:00"] }
    ]
  },

  // Remaining 10 (balanced across week)

  { id: 11, name: "Dr. Suresh Patel", gender: "Male", specialization: "Urology", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80", availability: [{ day: "Sunday", slots: ["09:00-11:00"] }] },
  { id: 12, name: "Dr. Ritu Chawla", gender: "Female", specialization: "Oncology", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80", availability: [{ day: "Monday", slots: ["14:00-16:00"] }] },
  { id: 13, name: "Dr. Mohit Aggarwal", gender: "Male", specialization: "Pulmonology", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80", availability: [{ day: "Tuesday", slots: ["09:00-11:00"] }] },
  { id: 14, name: "Dr. Kavita Deshmukh", gender: "Female", specialization: "Nephrology", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80", availability: [{ day: "Wednesday", slots: ["09:00-11:00"] }] },
  { id: 15, name: "Dr. Arjun Khanna", gender: "Male", specialization: "Gastroenterology", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80", availability: [{ day: "Thursday", slots: ["09:00-11:00"] }] },
  { id: 16, name: "Dr. Shalini Bose", gender: "Female", specialization: "Rheumatology", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80", availability: [{ day: "Friday", slots: ["09:00-11:00"] }] },
  { id: 17, name: "Dr. Nikhil Saxena", gender: "Male", specialization: "Radiology", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80", availability: [{ day: "Saturday", slots: ["14:00-16:00"] }] },
  { id: 18, name: "Dr. Ayesha Khan", gender: "Female", specialization: "Pathology", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80", availability: [{ day: "Sunday", slots: ["14:00-16:00"] }] },
  { id: 19, name: "Dr. Deepak Mishra", gender: "Male", specialization: "Anesthesiology", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80", availability: [{ day: "Monday", slots: ["11:30-13:30"] }] },
  { id: 20, name: "Dr. Tanvi Kulkarni", gender: "Female", specialization: "Ophthalmology", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80", availability: [{ day: "Saturday", slots: ["09:00-11:00"] }] }
];
