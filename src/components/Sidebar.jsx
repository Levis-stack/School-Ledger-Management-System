import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ handleGradeFilter }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(null); // Track the selected grade
  const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

  const toggleSidebar = () => setIsExpanded(prev => !prev);

  const handleGradeClick = (grade) => {
    setSelectedGrade(grade); // Set the selected grade
    handleGradeFilter(grade); // Pass grade to handleGradeFilter
  };

  return (
    <motion.div
      animate={{ height: isExpanded ? 'auto' : 50 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={`sidebar ${!isExpanded ? 'collapsed' : ''}`}
      style={{ padding: isExpanded ? '1rem' : '0.5rem' }}
    >
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="expanded-sidebar"
          >
            <div className="sidebar-header">
              <h3>Grades</h3>
              <button className="collapse-btn" onClick={toggleSidebar}>
                ❌
              </button>
            </div>
            <ul className="grade-list">
              {grades.map((grade) => (
                <motion.li
                  key={grade}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGradeClick(grade)} // Handle grade click
                  className={`grade-item ${selectedGrade === grade ? 'selected' : ''}`} // Add selected class if it's the selected grade
                >
                  {grade}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="collapsed-sidebar"
          >
            <div className="collapsed-header">
              <button className="expand-btn" onClick={toggleSidebar}>
                Grades
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar;
