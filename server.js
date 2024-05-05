const express = require('express');
const cors = require('cors');
const path = require('path');

const mongoose = require('mongoose');
const User = require('./model/user');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/flipr')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/Home.html');
// });

app.post('/api/user', async (req, res) => {
  try {
    console.log("====>>>>" + JSON.stringify(req.body))
    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    if (req.body.role) {
      newUser.role = req.body.role;
    }

    const data = await newUser.save();
    res.send("User save successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update user by ID
app.put('/api/users/:id', async (req, res) => {
  const { password, disabled } = req.body;
  console.log("========>>>req body" + JSON.stringify(req.body))
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { password, disabled }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
