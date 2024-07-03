import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const cookieOption = {
  MaxAge: 100 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const alreadyExists = await User.findOne({ email });
  if (alreadyExists) {
    return res.status(404).json({
      success: false,
      message: "User already exists",
    });
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    avatar: {
      secure_url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      public_id: "public_id",
    },
  });
  try {
    await user.save();
    res.status(200).json({ message: "User created successfully!", user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).json({
        message: "Some user credentials are missing",
      });
    }
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please sign up",
      });
    }
    if (await bcryptjs.compareSync(password, user.password)) {
      const payload = { id: user._id };
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });

      user.jwtToken = jwtToken;
      user.password = null;

      res.cookie("jwtToken", jwtToken, cookieOption);
      return res.status(200).json({
        success: true,
        jwtToken,
        message: "User logged in",
        user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Password incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const google = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      user.jwtToken = jwtToken;
      user.password = null;
      res.cookie("jwtToken", jwtToken, cookieOption).status(200).json({
        success: true,
        user,
      });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      user = new User({
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: {
          secure_url: req.body.photo,
          public_id: "public_id"
        },
      });
      await user.save();
      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      user.jwtToken = jwtToken;
      user.password = null;
      res.cookie("jwtToken", jwtToken, cookieOption).status(200).json({
        message: "User signed in",
        success: true,
        jwtToken,
        user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie('jwtToken');
    res.status(200).json({ success: true, message: 'User has been logged out!' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
