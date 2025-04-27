import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import DeleteConfirmation from './DeleteConfirmation';
import StudentTable from './StudentTable';
import Sidebar from './Sidebar';
import Sidebar2 from './Sidebar2';

const StudentList = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [gradeFilter, setGradeFilter] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('Term 1'); // << Track selected term

  // Fetch students based on selected term
  useEffect(() => {
    const endpoint = selectedTerm === 'Term 1' ? "Term1" 
                   : selectedTerm === 'Term 2' ? "Term2"
                   : "Term3";

    fetch(`http://localhost:5000/${endpoint}`)
      .then((res) => res.json())
      .then((data) => {
        const studentsWithStatus = data.map(student => {
          const overpayment = student.amountPaid > 50000 ? student.amountPaid - 50000 : 0;
          const amountPaid = student.amountPaid > 50000 ? 50000 : student.amountPaid;
          const feeStatus = amountPaid === 50000 ? 'paid' : amountPaid > 0 ? 'partial' : 'pending';

          return {
            ...student,
            amountPaid,
            overpayment,
            feeStatus
          };
        });
        setAllStudents(studentsWithStatus);
        setStudents(studentsWithStatus);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [selectedTerm]); // << re-fetch when selectedTerm changes

  useEffect(() => {
    if (gradeFilter === '') {
      setStudents(allStudents);
    } else {
      const filteredStudents = allStudents.filter(student => student.grade === gradeFilter);
      setStudents(filteredStudents);
    }
  }, [gradeFilter, allStudents]);

  const handleDelete = (student) => {
    setStudentToDelete(student);
  };

  const confirmDelete = () => {
    const endpoint = selectedTerm === 'Term 1' ? "Term1" 
                   : selectedTerm === 'Term 2' ? "Term2"
                   : "Term3";

    fetch(`http://localhost:5000/${endpoint}/${studentToDelete.id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          setAllStudents((prev) => prev.filter((student) => student.id !== studentToDelete.id));
          setStudents((prev) => prev.filter((student) => student.id !== studentToDelete.id));
          setStudentToDelete(null);
        } else {
          console.error("Failed to delete student.");
        }
      })
      .catch((err) => console.error("Error deleting student:", err));
  };

  const cancelDelete = () => {
    setStudentToDelete(null);
  };

  const updateStudentFee = (id, newAmountPaid) => {
    const overpayment = newAmountPaid > 50000 ? newAmountPaid - 50000 : 0;
    const amountPaid = newAmountPaid > 50000 ? 50000 : newAmountPaid;
    const feeStatus =
      amountPaid === 50000
        ? 'paid'
        : amountPaid > 0
        ? 'partial'
        : 'pending';

    const updated = allStudents.map(student => {
      if (student.id === id) {
        return { ...student, amountPaid, overpayment, feeStatus };
      }
      return student;
    });

    setAllStudents(updated);
    setStudents(updated);

    const endpoint = selectedTerm === 'Term 1' ? "Term1" 
                   : selectedTerm === 'Term 2' ? "Term2"
                   : "Term3";

    fetch(`http://localhost:5000/${endpoint}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountPaid, overpayment, feeStatus }),
    })
      .then(res => res.json())
      .then(data => console.log("Updated student fee and status:", data))
      .catch(err => console.error("Update fee error:", err));
  };

  const calculateOverpayment = (amountPaid) => {
    const totalFee = 50000;
    return amountPaid > totalFee ? amountPaid - totalFee : 0;
  };

  const calculateDeficit = (amountPaid) => {
    const totalFee = 50000;
    return totalFee - amountPaid;
  };

  const handleTermChange = (term) => {
    setSelectedTerm(term);
  };

  const handlePendingFees = (term) => {
    // Logic to handle pending fees when a term is selected
    const updatedStudents = allStudents.map(student => {
      if (student.feeStatus === 'pending') {
        return { ...student, feeStatus: 'pending' }; // update logic for pending status
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  const summary = useMemo(() => {
    const totalFee = 50000;
    const totalExpected = students.length * totalFee;
    const fullyPaid = students.filter(s => s.feeStatus === 'paid').reduce((sum, s) => sum + s.amountPaid, 0);
    const partiallyPaid = students.filter(s => s.feeStatus === 'partial').reduce((sum, s) => sum + s.amountPaid, 0);
    const totalPaid = fullyPaid + partiallyPaid;
    const totalPending = totalExpected - totalPaid;
    const totalOverpayment = students.reduce((sum, s) => sum + s.overpayment, 0);

    return {
      totalExpected,
      fullyPaid,
      partiallyPaid,
      totalPending,
      totalOverpayment
    };
  }, [students]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="student-list-container"
    >
      <div className="sidebar-container">
        <Sidebar handleGradeFilter={setGradeFilter} />
        <Sidebar2 selectedTerm={selectedTerm} handleTermChange={handleTermChange} handlePendingFees={handlePendingFees} />
      </div>

      <div className="student-list-content">
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Student Records ({students.length})
        </motion.h2>

        {/* Summary Section */}
        <motion.div 
          className="summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            marginBottom: '1rem',
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '10px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}
        >
          <div><strong>Total Expected:</strong> KES {summary.totalExpected.toLocaleString()}</div>
          <div><strong>Fully Paid:</strong> KES {summary.fullyPaid.toLocaleString()}</div>
          <div><strong>Partially Paid:</strong> KES {summary.partiallyPaid.toLocaleString()}</div>
          <div><strong>Total Pending:</strong> KES {summary.totalPending.toLocaleString()}</div>
          <div><strong>Total Overpayment:</strong> KES {summary.totalOverpayment.toLocaleString()}</div>
        </motion.div>

        {/* Students Table */}
        <StudentTable
          students={students}
          handleDelete={handleDelete}
          updateStudentFee={updateStudentFee}
          calculateDeficit={calculateDeficit}
          calculateOverpayment={calculateOverpayment}
          blurred={false} // << No blur
        />
      </div>

      {studentToDelete && (
        <DeleteConfirmation
          student={studentToDelete}
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
        />
      )}
    </motion.div>
  );
};

export default StudentList;
