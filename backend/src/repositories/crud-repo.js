
class CrudRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        try {
            const result = await this.model.create(data);
            return result;
        } catch (error) {
            console.log("Something went wrong in the Crud Repository Layer: create()", error);
            throw error;
        }
    }

    async destroy(modelId) {
        try {
            const result = await this.model.findByIdAndDelete(modelId);
            return result;
        } catch (error) {
            console.log("Something went wrong in the Crud Repository Layer: destroy()", error);
            throw error;
        }
    }

    async get(data) {    
        try {
            const result = await this.model.findOne(data);
            return result;
        } catch (error) {
            console.log("Something went wrong in the Crud Repository Layer: get()", error);
            throw error;
        }
    }

    async getAll() {
        try {
            const result = await this.model.find();
            return result;
        } catch (error) {
            console.log("Something went wrong in the Crud Repository Layer: getAll()", error);
            throw error;
        }
    }

    async update(modelId, data) {
        try {
            const result = await this.model.findByIdAndUpdate(modelId, data, { new: true });
            return result;
        } catch (error) {
            console.log("Something went wrong in the Crud Repository Layer: update()", error);
            throw error;
        }
    }
}

module.exports = CrudRepository;