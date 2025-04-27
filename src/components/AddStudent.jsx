import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const AddStudent = ({ addStudent, updateStudent, selectedStudent, setSelectedStudent }) => {
  const [studentData, setStudentData] = useState({
    name: '',
    admissionNumber: '',
    grade: '',
    amountPaid: '',
    term: ''
  });

  useEffect(() => {
    if (selectedStudent) {
      setStudentData(selectedStudent);
    }
  }, [selectedStudent]);

  const handleChange = (field, value) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, admissionNumber, grade, amountPaid, term } = studentData;

    if (!name || !admissionNumber || !grade || !amountPaid || !term) {
      toast.error('Please fill all fields');
      return;
    }

    const numericAmount = Number(amountPaid);
    const feeStatus = numericAmount === 50000
      ? 'paid'
      : numericAmount > 0
      ? 'partial'
      : 'pending';

    const fullStudent = {
      ...studentData,
      amountPaid: numericAmount,
      feeStatus
    };

    try {
      if (selectedStudent) {
        const res = await fetch(`http://localhost:5000/Term1/${selectedStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullStudent)
        });

        if (!res.ok) throw new Error('Failed to update student');
        const updated = await res.json();
        updateStudent(updated);
        toast.success('Student updated successfully!');
      } else {
        const newStudentWithId = {
          ...fullStudent,
          id: Date.now().toString()
        };

        const res = await fetch('http://localhost:5000/Term1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStudentWithId)
        });

        if (!res.ok) throw new Error('Failed to add student');
        const added = await res.json();
        addStudent(added);
        toast.success('Student added successfully!');
      }

      setStudentData({ name: '', admissionNumber: '', grade: '', amountPaid: '', term: '' });
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
      toast.error('Error saving student');
    }
  };

  return (
    <div className="add-student">
      <h2>{selectedStudent ? 'Edit Student' : 'Add New Student'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={studentData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Admission Number:</label>
          <input
            type="text"
            value={studentData.admissionNumber}
            onChange={(e) => handleChange('admissionNumber', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Grade:</label>
          <select
            value={studentData.grade}
            onChange={(e) => handleChange('grade', e.target.value)}
            required
          >
            <option value="">Select Grade</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
              <option key={g} value={`Grade ${g}`}>{`Grade ${g}`}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount Paid:</label>
          <input
            type="number"
            value={studentData.amountPaid}
            onChange={(e) => handleChange('amountPaid', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Term:</label>
          <select
            value={studentData.term}
            onChange={(e) => handleChange('term', e.target.value)}
            required
          >
            <option value="">Select Term</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="add-button"
        >
          {selectedStudent ? 'Update Student' : 'Add Student'}
        </motion.button>
      </form>
    </div>
  );
};

export default AddStudent;