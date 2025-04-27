import { motion } from 'framer-motion';
import FeeStatusButtons from './FeeStatusButtons';

const StudentTable = ({
  students,
  handleDelete,
  updateStudentFee,
  calculateDeficit,
  calculateOverpayment, // Add calculateOverpayment as a prop
  blurred
}) => {
  return (
    <div className={`table-container ${blurred ? 'blurred' : ''}`}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Admission No.</th>
            <th>Grade</th>
            <th>Amount Paid</th>
            <th>Deficit</th>
            <th>Overpayment</th> {/* New column for Overpayment */}
            <th>Fee Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <motion.tr
              key={student.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="student-row"
            >
              <td>{student.name}</td>
              <td>{student.admissionNumber}</td>
              <td>{student.grade}</td>
              
              {/* Amount Paid */}
              <td>
                <input
                  type="number"
                  value={student.amountPaid || 0}
                  onChange={(e) => updateStudentFee(student.id, parseFloat(e.target.value))}
                  placeholder="50,000"
                />
              </td>
              
              {/* Deficit Calculation */}
              <td>{calculateDeficit(student.amountPaid || 0)}</td>
              
              {/* Overpayment Calculation */}
              <td>{calculateOverpayment(student.amountPaid || 0) > 0 ? `KES ${calculateOverpayment(student.amountPaid || 0).toLocaleString()}` : 'KES 0'}</td> {/* Display Overpayment */}
              
              <td>
                <FeeStatusButtons 
                  student={student} 
                  updateStudentFee={updateStudentFee}
                />
              </td>
              <td>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(student)}
                  className="delete-button"
                >
                  Delete
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
