const CrudService = require('./crud-service');
const UserRepository = require('../repositories/user-repo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/serverConfig');


class UserService extends CrudService {
    constructor() {
        const userRepository = new UserRepository();
        super(userRepository);
    }

    async getUserByPhoneNumber(phoneNumber) {
        try {
            const user = await this.repo.findOne({
                phoneNumber: phoneNumber
            });
            return user;
        } catch (error) {
            console.log('Error in getUserByPhoneNumber:', error);
            throw error;
        }
    }

    async signUp (userData) {
        try {
            const user = await this.repo.create(userData);
            return user;
        } catch (error) {
            console.error('Error in signUp:', error);
            throw error;
        }
    }

    async signIn (email, plainPassword) {
        try {
            const userByEmail = await this.repo.get({ email: email });
            if(!userByEmail) {
                throw { error: 'Invalid email or password' };
            }
            const passwordsMatch = await bcrypt.compare(plainPassword, userByEmail.password);
            if(!passwordsMatch) {
                throw { error: 'Invalid email or password' };
            }
            const jwtToken = this.createToken({email: userByEmail.email, id: userByEmail.id});
            return jwtToken;
        } catch (error) {
            console.error('Error in signIn:', error);
            throw error;
        }
    }

    async createToken (payload) {
        try {
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            return token;
        } catch (error) {
            console.log('Error in createToken:', error);    
            throw { error };
        }
    }

    async isAuthenticated (token) {
        try {
            const response = jwt.verify(token, JWT_SECRET);
            if(!response) {
                throw { error: 'Invalid token' };
            }
            // Use correct filter for Mongoose findOne
            const user = await this.repo.get({ _id: response.id });
            if(!user) {
                throw { error: 'Invalid token' };
            }
            return user.id;
        } catch (error) {
            console.error('Error in isAuthenticated:', error);
            throw { error: 'Invalid token' };
        }
    }
    
}

module.exports = UserService;