import React from 'react';

const DeleteConfirmation = ({ student, confirmDelete, cancelDelete, error }) => {
  return (
    <div className="delete-confirmation">
      <div className="delete-modal">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete {student.name}'s record?</p>
        
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            Error: {error}
          </div>
        )}
        
        <div className="button-group">
          <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
          <button onClick={confirmDelete} className="confirm-delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;