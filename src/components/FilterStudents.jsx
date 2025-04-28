import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios'; // Make sure you install axios or use fetch

const FilterStudents = ({ filter, setFilter, setSelectedStudent }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
  try {
    const response = await axios.get('http://localhost:3000/Term1'); // <-- 5000 not 3000
    setStudents(response.data);
    toast.success("Students loaded successfully!");
  } catch (error) {
    console.error('Failed to fetch students:', error);
    toast.error("Failed to load students. Please try again later.");
  }
};


    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilter({
      admissionNumber: '',
      grade: '',
      feeStatus: ''
    });
    setSelectedStudent(null);
  };

  const handleSearch = () => {
    const { admissionNumber, grade } = filter;

    if (!admissionNumber.trim()) {
      toast.info("Please enter an admission number.");
      return;
    }

    if (!students || students.length === 0) {
      toast.error("No students available. Please add students first.");
      return;
    }

    const matchedStudent = students.find(
      student => student.admissionNumber.toLowerCase() === admissionNumber.trim().toLowerCase()
    );

    if (matchedStudent) {
      if (grade && matchedStudent.grade !== grade) {
        toast.error(`Grade mismatch! Expected ${matchedStudent.grade}, but selected ${grade}.`);
        setSelectedStudent(null);
      } else {
        setSelectedStudent(matchedStudent);
        toast.success("Student found!");
      }
    } else {
      setSelectedStudent(null);
      toast.warning("Student not found. Please make sure the admission number is correct.");
    }
  };

  return (
    <div className="filter-students">
      <h2>🎯 Find Student</h2>

      {/* Admission number with search button */}
      <div className="filter-group admission-group">
        <label>Admission Number:</label>
        <div className="search-row">
          <input
            type="text"
            name="admissionNumber"
            value={filter.admissionNumber}
            onChange={handleChange}
            placeholder="Search by admission number"
          />
          <button onClick={handleSearch} className="search-btn">Search</button>
        </div>
      </div>

      {/* Grade Filter */}
      <div className="filter-group">
        <label>Grade:</label>
        <select
          name="grade"
          value={filter.grade}
          onChange={handleChange}
        >
          <option value="">All Grades</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
            <option key={grade} value={`Grade ${grade}`}>Grade {grade}</option>
          ))}
        </select>
      </div>

      {/* Fee Status Filter */}
      <div className="filter-group">
        <label>Fee Status:</label>
        <select
          name="feeStatus"
          value={filter.feeStatus}
          onChange={handleChange}
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      {/* Button to clear all filters */}
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
    </div>
  );
};

export default FilterStudents;
