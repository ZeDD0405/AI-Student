const FormDataModel = require("../models/FormData");

// ---------------- Registration ----------------
const register = async (req, res) => {
  const { rollNo, name, password, confirmPassword } = req.body;

  if (!rollNo || !name || !password || !confirmPassword)
    return res.status(400).json({ error: "All fields are required" });

  if (password !== confirmPassword)
    return res.status(400).json({ error: "Passwords do not match" });

  try {
    const existingUser = await FormDataModel.findOne({ rollNo });
    if (existingUser)
      return res.status(400).json({ error: "Roll number already registered" });

    const newUser = new FormDataModel({ rollNo, name, password });
    await newUser.save();

    res.status(201).json({
      message: "Registration successful",
      user: { rollNo: newUser.rollNo, name: newUser.name },
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Login ----------------
const login = async (req, res) => {
  const { rollNo, password } = req.body;

  if (!rollNo || !password)
    return res.status(400).json({ error: "Roll number and password are required" });

  try {
    const user = await FormDataModel.findOne({ rollNo });
    if (!user)
      return res.status(404).json({ error: "No records found for this roll number" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ error: "Wrong password" });

    res.json({
      message: "Login successful",
      user: { rollNo: user.rollNo, name: user.name },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login };