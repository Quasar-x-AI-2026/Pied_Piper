class CrudService {
    constructor(repo) {
        this.repo = repo;
    }
    
    async create(data) {
        try {
            if (typeof this.repo.create !== 'function') {
                throw new Error('Repository does not implement create()');
            }
            const response = await this.repo.create(data);
            return response;
        } catch (error) {
            console.log("Something went wrong in the Crud Service Layer: create()", error);
            throw error;
        }
    }

    async destroy(modelId) {
        try {
            const response = await this.repo.destroy(modelId);
            return response;
        } catch (error) {
            console.log("Something went wrong in the Crud Service Layer: destroy()", error);
            throw error;
        }
    }

    async get(modelId) {    
        try {
            const response = await this.repo.get(modelId);
            return response;
        } catch (error) {
            console.log("Something went wrong in the Crud Service Layer: get()", error);
            throw error;
        }
    }

    async getAll() {
        try {
            const response = await this.repo.getAll();
            return response;
        } catch (error) {
            console.log("Something went wrong in the Crud Service Layer: getAll()", error);
            throw error;
        }
    }

    async update(modelId, data) {
        try {
            const response = await this.repo.update(modelId, data);
            return response;
        } catch (error) {
            console.log("Something went wrong in the Crud Service Layer: update()", error);
            throw error;
        }
    }
}

module.exports = CrudService;

const axios = require('axios');

async function callBotAPI(payload) {
  try {
    const response = await axios.post('BOT_API_URL', payload, {
      timeout: 10000 // 10 seconds instead of 30
    });
    return response.data;
  } catch (error) {
    console.error('Error calling bot API:', error.message);
    // Optionally, log error.response?.data for more details
    throw new Error('Bot API unavailable');
  }
}