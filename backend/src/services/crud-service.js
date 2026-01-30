class CrudService {
    constructor(respo) {
        this.repo = repo;
    }
    
    async create(data) {
        try {
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