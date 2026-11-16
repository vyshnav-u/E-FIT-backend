const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// resgistration controller

const registrationController = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Enter all Fields"
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({

                message: "Email Already in Use"
            })
        }
        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10)
        // add user to mongoDB
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        })
        return res.status(201).json({
            message: "User created Succesfully",
            user: {
                id: newUser._id,
                name: newUser.username,
                email: newUser.email
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Registration Failed"
        })

    }
}

// Login Controller

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "Fields are missing"
            })
        }
        const findUser = await User.findOne({ email })
        if (!findUser) {
            return res.status(404).json({
                message: "User not Found"
            })
        }
        // hash password compare
        const isPasswordValid = await bcrypt.compare(password, findUser.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "invalid Password"
            })
        }
        // jwt token creation
        const token = jwt.sign(
            {
                userId: findUser._id,
                role: findUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        return res.status(200).json({
            message: "Login Successful",
            token: token,
            user: {
                userId: findUser._id,
                username: findUser.username,
                email: findUser.email,
                role: findUser.role
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Login Failed"
        })


    }
}
// profile Controller
const profileController = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password')

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.json({
            message: "Profile accessed successfully",
            user: user
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server Error"
        })
    }
}
// update profile Controller
const updateProfileController = async (req, res) => {
    const userId = req.user.userId
    const {
        username,
        email,
        phone,
        gender,
        dob,
        address,
        height,
        weight,
        fitnessGoal,
        emergencyContact
    } = req.body
    try {
        const updateUser = await User.findByIdAndUpdate(userId,
            {
                username,
                email, phone,
                gender,
                dob,
                address,
                height,
                weight,
                fitnessGoal,
                emergencyContact
            },
            {
                new: true,
                runValidators: true
            }

        ).select("-password")
        if (!updateUser) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        return res.status(200).json({
            message: "Profile Updated",
            user: updateUser
        })
    } catch (error) {
        return res.status(500).json({
            message: "Profile not Updated"
        })
    }

}

const getAllUsersController = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ _id: -1 });

        return res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};

const deleteUserController = async (req, res) => {
    try {
        const userId = req.params.id;

        if (String(req.user.userId) === userId) {
            return res.status(400).json({
                message: "You cannot delete your own admin account"
            });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Failed to delete user"
        });
    }
};

const uploadProfileImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select an image."
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                profileImage: `/uploads/${req.file.filename}`
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            message: "Profile picture uploaded successfully.",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Profile picture upload failed."
        });
    }
};


module.exports = { uploadProfileImageController,registrationController, deleteUserController, getAllUsersController, loginController, profileController, updateProfileController }