const { Admin } = require('../models/Admin');

const adminController = {
    async getAllUsers(req, res) {
        try {
            const users = await Admin.getAllUsers();
            res.json(users);
        } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
    },

    async makeAdmin(req, res) {
        try {
            const { id } = req.params;
            const user = await Admin.makeAdmin(id);
                
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
        
            res.json({
                message: 'User promoted to admin',
                user
            });
        } catch (error) {
            console.error('Make admin error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({ error: 'Cannot delete yourself' });
            }
            const user = await Admin.deleteUser(id);
             if (!user) {
            return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = { adminController };