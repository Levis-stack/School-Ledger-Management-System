import React, { createContext, useEffect, useState, useContext } from 'react';

const StudentContext = createContext();

export function useStudents() {
  return useContext(StudentContext);
}

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Port corrigé ici
  const API_URL = 'http://localhost:3001/students';

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
      setLoading(false);
      console.log('Fetched students:', data); // Debug log
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  // Add student
  const admitStudent = async (student) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });
      const newStudent = await res.json();
      setStudents((prev) => [...prev, newStudent]);
    } catch (err) {
      console.error('Failed to admit student:', err);
    }
  };

  // Delete student
  const deleteStudent = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  // Update student payment
  const adjustPayment = async (id, amount) => {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    const updatedAmountPaid = student.amountPaid + amount;
    const totalFees = student.totalFees;
    const paymentStatus =
      updatedAmountPaid >= totalFees
        ? 'Paid'
        : updatedAmountPaid > 0
        ? 'Partial'
        : 'Unpaid';

    const updatedStudent = {
      ...student,
      amountPaid: updatedAmountPaid,
      paymentStatus,
    };

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent),
      });
      const data = await res.json();
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? data : s))
      );
    } catch (err) {
      console.error('Failed to adjust payment:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        admitStudent,
        deleteStudent,
        adjustPayment,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
