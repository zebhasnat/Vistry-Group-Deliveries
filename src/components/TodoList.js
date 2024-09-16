import React, { useState, useEffect } from "react";
import logo from "../images/logo.jpeg";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  Table,
  Button,
  Input,
  Space,
  TimePicker,
  AutoComplete,
  Modal,
} from "antd";
import "antd/dist/reset.css"; // Import Ant Design styles
import moment from "moment"; // For handling time formats

const LOCAL_STORAGE_KEY = "todos";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString(),
    name: "",
    employer: "",
    vehicleReg: "",
    inductionNum: "",
    timeIn: null,
    timeOut: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(70);
  const [editingIndex, setEditingIndex] = useState(null);
  const [nameOptions, setNameOptions] = useState([
    "Andy",
    "Chris",
    "James",
    "Ian",
    "Steve",
    "Lee",
    "Mark",
    "Alan",
    "Geoff",
    "Keith",
    "Kat",
    "Richard",
  ]);
  const [companyOptions, setCompanyOptions] = useState([
    "AMC",
    "Kennys Skip",
    "Tarmac",
    "Sunbelt",
    "Landscapers",
    "Berry's",
    "Forterra",
    "2U Food",
    "Pas",
    "Holland Electrical",
    "Search",
    "JCB",
    "SAS",
    "Keyline",
    "Travis Perkins",
    "NW Fuel",
    "Hertings",
    "P P Connor",
    "Marshalls",
    "Worseley",
  ]);

  const isButton =
    formData.name.trim().length === 0 ||
    formData.employer.trim().length === 0 ||
    formData.vehicleReg.trim().length === 0 ||
    formData.inductionNum.trim().length === 0 ||
    formData.timeIn === null ||
    formData.timeOut === null;

  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  useEffect(() => {
    // Load todos from local storage on component mount
    const savedTodos =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setTodos(savedTodos);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeChange = (time, timeString, field) => {
    setFormData({ ...formData, [field]: timeString });
  };

  const handleNameChange = (value) => {
    if (value === "other") {
      setFormData({ ...formData, name: "" });
    } else {
      setFormData({ ...formData, name: value });
    }
  };

  const handleCompanyChange = (value) => {
    if (value === "other") {
      setFormData({ ...formData, employer: "" });
    } else {
      setFormData({ ...formData, employer: value });
    }
  };

  const handleNameInputChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleCompanyInputChange = (e) => {
    setFormData({ ...formData, employer: e.target.value });
  };

  const addTodo = () => {
    if (editingIndex !== null) {
      const updatedTodos = [...todos];
      updatedTodos[editingIndex] = formData;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
      setEditingIndex(null);
    } else {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify([...todos, { ...formData }])
      );
      setTodos([...todos, { ...formData }]);
    }

    setFormData({
      date: new Date().toLocaleDateString(),
      name: "",
      employer: "",
      vehicleReg: "",
      inductionNum: "",
      timeIn: null,
      timeOut: null,
    });
  };

  const editTodo = (index) => {
    const actualIndex = (currentPage - 1) * pageSize + index;
    setFormData(todos[actualIndex]);
    setEditingIndex(actualIndex);
  };

  const confirmDelete = (index) => {
    setConfirmDeleteIndex(index);
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => handleDelete(index),
      onCancel: () => setConfirmDeleteIndex(null),
    });
  };

  const handleDelete = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    setConfirmDeleteIndex(null);
  };

  const confirmDeleteAll = () => {
    Modal.confirm({
      title: "Are you sure you want to delete all item?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => handleDeleteAll(),
      onCancel: () => setConfirmDeleteIndex(null),
    });
  };

  const handleDeleteAll = (index) => {
    setTodos([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.addImage(logo, "JPEG", 14, 10, 40, 20); // Adjust the x, y, width, and height to your preference

    doc.autoTable({
      startY: 30,
      head: [
        [
          "Date",
          "Name",
          "Company Name",
          "Vehicle Reg No",
          "Induction Num",
          "Time In",
          "Time Out",
        ],
      ],
      body: todos.map((todo) => [
        todo.date,
        todo.name,
        todo.employer,
        todo.vehicleReg,
        todo.inductionNum,
        todo.timeIn,
        todo.timeOut,
      ]),
    });
    doc.save("todo-list.pdf");
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Company Name", dataIndex: "employer", key: "employer" },
    { title: "Vehicle Reg No", dataIndex: "vehicleReg", key: "vehicleReg" },
    { title: "Induction Num", dataIndex: "inductionNum", key: "inductionNum" },
    { title: "Time In", dataIndex: "timeIn", key: "timeIn" },
    { title: "Time Out", dataIndex: "timeOut", key: "timeOut" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record, index) => (
        <Space size="middle">
          <Button
            onClick={() => editTodo(index)}
            icon={<FontAwesomeIcon icon={faEdit} />}
          />
          <Button
            onClick={() => confirmDelete(index)}
            icon={<FontAwesomeIcon icon={faTrash} />}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.logoImageContainer}>
        <img src={logo} alt="logo" style={styles.logoImage} />
      </div>
      {/* <h2 style={styles.header}>Vistry Group Deliveries</h2> */}
      <div style={styles.form}>
        <AutoComplete
          value={formData.name}
          onChange={handleNameChange}
          onSelect={(value) => setFormData({ ...formData, name: value })}
          style={styles.input}
          placeholder="Select or Enter Name"
        >
          {nameOptions.sort().map((name) => (
            <AutoComplete.Option key={name} value={name}>
              {name}
            </AutoComplete.Option>
          ))}
          <AutoComplete.Option value="other">Other...</AutoComplete.Option>
        </AutoComplete>
        {formData.name === "other" && (
          <Input
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleNameInputChange}
            style={styles.input}
          />
        )}
        <AutoComplete
          value={formData.employer}
          onChange={handleCompanyChange}
          onSelect={(value) => setFormData({ ...formData, employer: value })}
          style={styles.input}
          placeholder="Select or Enter Company Name"
        >
          {companyOptions.sort().map((company) => (
            <AutoComplete.Option key={company} value={company}>
              {company}
            </AutoComplete.Option>
          ))}
          <AutoComplete.Option value="other">Other...</AutoComplete.Option>
        </AutoComplete>
        {formData.employer === "other" && (
          <Input
            name="employer"
            placeholder="Enter Company Name"
            value={formData.employer}
            onChange={handleCompanyInputChange}
            style={styles.input}
          />
        )}
        <Input
          name="vehicleReg"
          placeholder="Vehicle Reg No"
          value={formData.vehicleReg}
          onChange={handleInputChange}
          style={styles.input}
        />
        <Input
          name="inductionNum"
          placeholder="Confirm Electronic Induction Number"
          value={formData.inductionNum}
          onChange={handleInputChange}
          style={styles.input}
        />
        <TimePicker
          name="timeIn"
          placeholder="Time In"
          format="HH:mm"
          value={formData.timeIn ? moment(formData.timeIn, "HH:mm") : null}
          onChange={(time, timeString) =>
            handleTimeChange(time, timeString, "timeIn")
          }
          style={styles.timePicker}
        />
        <TimePicker
          name="timeOut"
          placeholder="Time Out"
          format="HH:mm"
          value={formData.timeOut ? moment(formData.timeOut, "HH:mm") : null}
          onChange={(time, timeString) =>
            handleTimeChange(time, timeString, "timeOut")
          }
          style={styles.timePicker}
        />
        <Button
          onClick={addTodo}
          style={isButton ? styles.GrayButton : styles.addButton}
          disabled={isButton}
        >
          {editingIndex !== null ? "Update" : "Add"}
        </Button>
      </div>

      <Table
        dataSource={todos}
        columns={columns}
        rowKey="date" // Or another unique identifier
        pagination={{ pageSize }} // Control page size
        style={styles.table}
      />
      {todos.length > 0 && (
        <div style={styles.btns}>
          <Button onClick={downloadPDF} style={styles.downloadButton}>
            Download PDF
          </Button>
          <Button
            onClick={confirmDeleteAll}
            style={styles.downloadDeleteButton}
          >
            Delete All Enteries
          </Button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "90%",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
    marginTop: "20px",
  },
  logoImageContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  logoImage: {
    width: "300px",
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: "1",
    minWidth: "200px",
  },
  timePicker: {
    flex: "1",
    minWidth: "200px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  GrayButton: {
    padding: "10px 20px",
    backgroundColor: "grey",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
  },

  btns: {
    display: "flex",
    alignItems: "center",
  },

  downloadButton: {
    backgroundColor: "#2196F3",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",
    marginTop: "20px",
  },
  downloadDeleteButton: {
    backgroundColor: "#d11a2a",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",
    marginTop: "20px",
    marginLeft: "10px",
  },
};

export default TodoList;
