import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AddStudent from '../components/AddStudent';
import FilterStudents from '../components/FilterStudents';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = ({ addStudent, deleteStudent, updateStudentFee, updateStudent }) => {
  const [filter, setFilter] = useState({
    admissionNumber: '',
    grade: '',
  });

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/students/Term1");
        const data = await response.json();
        const studentsWithStatus = data.map(student => ({
          ...student,
          feeStatus: student.amountPaid === 50000 ? 'paid' : student.amountPaid > 0 ? 'partial' : 'pending'
        }));
        setStudents(studentsWithStatus);
        setFilteredStudents(studentsWithStatus);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = () => {
    const { admissionNumber, grade } = filter;
    let results = students;

    if (admissionNumber) {
      results = results.filter(student => 
        student.admissionNumber.includes(admissionNumber)
      );
    }

    if (grade) {
      results = results.filter(student => student.grade === grade);
    }

    setFilteredStudents(results);

    if (results.length === 1) {
      setSelectedStudent(results[0]);
    } else {
      setSelectedStudent(null);
    }
  };

  const clearFilters = () => {
    setFilter({
      admissionNumber: '',
      grade: '',
    });
    setFilteredStudents(students);
    setSelectedStudent(null);
  };

  // Dummy usage to prevent ESLint unused warnings (remove when used in UI)
  console.log(filteredStudents, handleSearch, clearFilters);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="dashboard"
    >
      <h1>Student Fee Management</h1>
      
      <div className="dashboard-grid">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="card add-student-card"
        >
          <AddStudent
            addStudent={(student) => setStudents([...students, student])}
            updateStudent={(updated) =>
              setStudents((prev) =>
                prev.map((s) => (s.id === updated.id ? updated : s))
              )
            }
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="card filter-card"
        >
          <FilterStudents 
            students={students || []} 
            setFilter={setFilter} 
            filter={filter} 
            setSelectedStudent={setSelectedStudent}
          />
        </motion.div>

        
      </div>

      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored"
      />
    </motion.div>
  );
};

export default Dashboard;