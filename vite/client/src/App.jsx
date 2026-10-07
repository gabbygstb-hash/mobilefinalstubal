import { useState, useEffect } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error students:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async () => {
    if (!name || !course || !age) {
      alert("fill all fields");
      return;
    }

    if (editingId) {
      try {
        const response = await fetch(`http://localhost:5000/students/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, course, age }),
        });

        if (response.ok) {
          fetchStudents();
          resetForm();
        }
      } catch (error) {
        console.error("Error updating", error);
      }
    } else {
      try {
        const response = await fetch("http://localhost:5000/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, course, age }),
        });

        if (response.ok) {
          fetchStudents();
          resetForm();
        }
      } catch (error) {
        console.error("Error adding", error);
      }
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/students/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null);
  };

  return (
    <div>
      <h1>Student Management System</h1>

      <h2>{editingId ? "Edit Student" : "Add Student"}</h2>
      <input
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />
      <input
        placeholder="Enter Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />
      <br /><br />
      <input
        placeholder="Enter Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <br /><br />
      <button onClick={handleSubmit}>
        {editingId ? "Update Student" : "Add Student"}
      </button>
      {editingId && (
        <button onClick={resetForm}>
          Cancel
        </button>
      )}

      <h2>Students</h2>
      {students.length === 0 ? (
        <p>No students yet.</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student._id} >
              {student.name}  {student.course} (Age: {student.age}){" "}
              <button onClick={() => handleEdit(student)}>Edit</button>{" "}
              <button onClick={() => handleDelete(student._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;