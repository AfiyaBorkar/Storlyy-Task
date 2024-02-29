const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
app.use(cors());
dotenv.config()
// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));

// Define mongoose schema and model for user
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, './user-form/build')));
// Routes

// Form Submission Route
app.post("/user-form", async (req, res) => {
  const { name, dob, email, phone } = req.body;

  // Calculate user's age based on the date of birth
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // Check if the user is at least 18 years old
  if (age < 18) {
    sendEmail(
      email,
      "Form Submission Rejected",
      "Sorry, you must be at least 18 years old to submit this form. \n \n Best Regards, \n Afiya Borkar"
    );
    return res
      .status(400)
      .json({ error: "You must be at least 18 years old to submit this form" });
  }

  // Save user to MongoDB
  try {
    const newUser = new User({ name, dob, email, phone });
    await newUser.save();

    // Send email immediately upon form submission
    sendEmail(
      email,
      "Form Submission Confirmation",
      "Your form has been submitted successfully. \n \n Best Regards, \n Afiya Borkar"
    );

    res
      .status(200)
      .json({ message: "Form submitted successfully", data: newUser });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Failed to submit form" });
  }
});

// Route to get all forms filled by a user
app.get("/forms/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const forms = await User.find({ email: email }); // Query forms by email
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Function to send email
function sendEmail(to, subject, text) {
  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "arfiesolutions@gmail.com",
      pass: "kbwj eljt fgwd hhim",
    },
  });

  // Email options
  const mailOptions = {
    from: "arfiesolutions@gmail.com",
    to,
    subject,
    text,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './user-form/build/index.html'));
});
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
