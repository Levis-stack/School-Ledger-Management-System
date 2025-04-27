import React, { useState } from 'react';

function Sidebar2({ selectedTerm, handlePendingFees, handleTermChange: parentHandleTermChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleTermChange = (term) => {
    const termOrder = {
      'Term 1': 1,
      'Term 2': 2,
      'Term 3': 3,
    };

    const current = termOrder[selectedTerm];
    const clicked = termOrder[term];

    console.log('Clicked:', clicked, 'Current:', current); // You can keep or remove this

    // Removed toast logic

    parentHandleTermChange(term);
  };

  const handleTermClick = (term) => {
    handleTermChange(term);
    handlePendingFees(term);  // Mark fees for the selected term
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar2 ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="collapse-toggle2" onClick={toggleCollapse}>
        {isCollapsed ? 'Terms' : 'Collapse'}
      </button>
      
      <h3 style={{ backgroundColor: 'transparent' }}>
        {isCollapsed ? '' : `Select Term`}
      </h3>
      
      <ul className={`term-list2 ${isCollapsed ? 'collapsed-list' : ''}`}>
        {['Term 1', 'Term 2', 'Term 3'].map((term) => (
          <li
            key={term}
            onClick={() => handleTermClick(term)}
            className={`term-item2 ${selectedTerm === term ? 'selected' : ''}`}
          >
            {term}
          </li>
        ))}
      </ul>
      
      <div className="selected-term">
        <p>Selected Term: {selectedTerm}</p>
      </div>
    </div>
  );
}

export default Sidebar2;
