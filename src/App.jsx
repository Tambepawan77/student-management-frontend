import { useEffect, useState } from "react"
import "./App.css"
import axios from "axios"

function App() {
  const BASE_URL = 'https://student-management-backend-9b20.onrender.com'

  const [students, setStudents] = useState([])
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [course, setCourse] = useState('')
  const [isEdit, setIsEdit] = useState(false)

  // Fetch all students
  async function getAllStudents() {
    try {
      const response = await axios.get(`${BASE_URL}/students`)
      setStudents(response.data)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  useEffect(() => {
    getAllStudents()
  }, [])

  // Input handlers
  function storeId(event) {
    setId(event.target.value)
  }
  function storeName(event) {
    setName(event.target.value)
  }
  function storeCourse(event) {
    setCourse(event.target.value)
  }

  // Clear input fields
  function resetForm() {
    setId('')
    setName('')
    setCourse('')
    setIsEdit(false)
  }

  // Create or Update student
  async function sendData(event) {
    event.preventDefault() // Prevents page reload

    try {
      if (isEdit === false) {
        const response = await axios.post(`${BASE_URL}/students`, {
          id: id,
          name: name,
          course: course
        })
        window.alert(response.data.detail || "Student added successfully!")
      } else {
        const response = await axios.put(`${BASE_URL}/students/${id}`, {
          id: id,
          name: name,
          course: course
        })
        window.alert(response.data.detail || "Student updated successfully!")
      }

      // Refresh table and clear the form
      getAllStudents()
      resetForm()
    } catch (error) {
      console.error("Error saving data:", error)
      window.alert("Failed to submit data.")
    }
  }

  // Populate form for editing
  function edit(student) {
    setId(student.id)
    setName(student.name)
    setCourse(student.course)
    setIsEdit(true)
  }

  // Delete student
  async function deleteRecord(studentId) {
    try {
      const response = await axios.delete(`${BASE_URL}/students/${studentId}`)
      window.alert(response.data.detail || "Student deleted successfully!")
      getAllStudents() // Refresh table
    } catch (error) {
      console.error("Error deleting student:", error)
      window.alert("Failed to delete student.")
    }
  }

  return (
    <div className="container">
      <h1>Student Management System</h1>

      <form className="student-form" onSubmit={sendData}>
        <input 
          type="number" 
          placeholder="ID" 
          onChange={storeId} 
          value={id} 
          disabled={isEdit} // Disables changing ID during edits
        />
        <input 
          type="text" 
          placeholder="Name" 
          onChange={storeName} 
          value={name} 
        />
        <input 
          type="text" 
          placeholder="Course" 
          onChange={storeCourse} 
          value={course} 
        />
        <button type="submit">{isEdit ? 'Update' : 'Submit'}</button>
        {isEdit && (
          <button type="button" onClick={resetForm} style={{ marginLeft: "8px" }}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Course</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.course}</td>
              <td>
                <button className="edit-btn" onClick={() => edit(student)}>
                  Edit
                </button>
              </td>
              <td>
                <button className="delete-btn" onClick={() => deleteRecord(student.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App