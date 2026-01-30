
const UserService = require('../services/user-service');
const userService = new UserService();

const createUser = async (req, res) => {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            preferredLanguage: req.body.preferredLanguage,
        };
        const user = await userService.signUp(userData);
        return res.status(201).json({
            data: user,
            success: true,
            message: 'User created successfully',
            err: {}
        });
    } catch (error) {
        console.error('Error in createUser controller:', error);
        return res.status(500).json({ 
            data: {},
            success: false,
            message: 'Failed to create user',       
            err: error
        });
    }
};

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await userService.signIn(email, password);
        return res.status(200).json({
            data: { token },
            success: true,
            message: 'User signed in successfully',
            err: {}
        });
    } catch (error) {
        console.error('Error in signInUser controller:', error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to sign in user',
            err: error
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userService.get({ _id: userId }); // <-- fix here
        return res.status(200).json({
            data: user,
            success: true,
            message: 'User profile fetched successfully',
            err: {}
        });
    } catch (error) {
        console.error('Error in getUserProfile controller:', error);
        return res.status(500).json({   
            data: {},
            success: false,
            message: 'Failed to fetch user profile',    
            err: error
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;
        const updatedUser = await userService.update(userId, updateData);
        return res.status(200).json({
            data: updatedUser,
            success: true,
            message: 'User profile updated successfully',
            err: {}
        });
    } catch (error) { 
        console.error('Error in updateUserProfile controller:', error);
        return res.status(500).json({   
            data: {},
            success: false,
            message: 'Failed to update user profile',    
            err: error
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        await userService.delete({ id: userId });
        return res.status(200).json({
            data: {},
            success: true,
            message: 'User deleted successfully',
            err: {}
        });
    } catch (error) {
        console.error('Error in deleteUser controller:', error);
        return res.status(500).json({   
            data: {},   
            success: false,
            message: 'Failed to delete user',    
            err: error
        });
    }
};

module.exports = {
    createUser,
    signInUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,
};