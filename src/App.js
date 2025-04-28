import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import StudentList from './components/StudentList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

const API_BASE_URL = "http://localhost:5000/Term1"; // Ensure this matches your backend API endpoint

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  // Fetch students from localStorage or API on load
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const savedStudents = localStorage.getItem('students');
        let studentsData = [];

        if (savedStudents) {
          studentsData = JSON.parse(savedStudents);
        } else {
          const response = await fetch(`${API_BASE_URL}/students`);
          if (!response.ok) {
            throw new Error('Failed to fetch students from API');
          }
          studentsData = await response.json();
          localStorage.setItem('students', JSON.stringify(studentsData));
        }

        const studentsWithStatus = studentsData.map(student => ({
          ...student,
          feeStatus: student.amountPaid === 50000 ? 'paid' : student.amountPaid > 0 ? 'partial' : 'pending',
        }));

        setStudents(studentsWithStatus);
      } catch (err) {
        console.error('Error fetching students:', err);
        alert('There was an error loading student data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle term change (from settings or elsewhere)
  const handleTermChange = (term) => {
    setSelectedTerm(term);
    console.log('Term changed to:', term);
  };

  // Handle pending fees based on the selected term
  const handlePendingFees = (term) => {
    console.log('Handling pending fees for term:', term);
  };

  // Add a new student
  const addStudent = (newStudent) => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);
  };

  // Delete a student
  const deleteStudent = (id) => {
    setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
  };

  // Update student fee (centralized here)
  const updateStudentFee = async (studentId, newAmountPaid) => {
    const amountPaid = parseInt(newAmountPaid, 10);
    const updatedStudents = [...students];
    const studentIndex = updatedStudents.findIndex((s) => s.id === studentId);

    if (studentIndex === -1) {
      console.error(`Student with ID ${studentId} not found`);
      alert('Student not found!');
      return;
    }

    updatedStudents[studentIndex] = {
      ...updatedStudents[studentIndex],
      amountPaid,
      feeStatus: amountPaid === 50000 ? 'paid' : amountPaid > 0 ? 'partial' : 'pending',
    };

    setStudents(updatedStudents); // Optimistically update the UI

    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amountPaid,
          feeStatus: updatedStudents[studentIndex].feeStatus,
        }),
      });

      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to update student fee: ${response.statusText}`);
      }

      console.log('Successfully updated student fee:', responseBody);

      // Update local storage with the latest data
      localStorage.setItem('students', JSON.stringify(updatedStudents));
    } catch (err) {
      console.error('Error updating student fee:', err);

      // Revert to the previous state if the update failed
      setStudents(students);

      // Optionally, notify the user
      alert('There was an error updating the fee. Please try again.');
    }
  };

  // Update a student's details (e.g., name or other fields)
  const updateStudent = (updatedStudent) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => (student.id === updatedStudent.id ? updatedStudent : student))
    );
  };

  if (loading) {
    return <div>Loading students...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  students={students}
                  addStudent={addStudent}
                  deleteStudent={deleteStudent}
                  updateStudentFee={updateStudentFee}  // Pass updateStudentFee here
                  updateStudent={updateStudent}
                  selectedTerm={selectedTerm}
                  handleTermChange={handleTermChange}
                  handlePendingFees={handlePendingFees}
                />
              }
            />
            <Route
              path="/reports"
              element={<Reports students={students} selectedTerm={selectedTerm} />}
            />
            <Route
              path="/settings"
              element={<Settings handleTermChange={handleTermChange} settingsTerm={selectedTerm} />}
            />
            <Route
              path="/studentlist"
              element={
                <StudentList
                  students={students}
                  deleteStudent={deleteStudent}
                  updateStudent={updateStudent}
                  selectedTerm={selectedTerm}
                  handleTermChange={handleTermChange}
                  handlePendingFees={handlePendingFees}
                />
              }
            />
          </Routes>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
