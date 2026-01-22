const express = require("express");
const router = express.Router();
const { register, login, getStudent, getAllStudents } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/students", getAllStudents);
router.get("/student/:rollNo", getStudent);

module.exports = router;