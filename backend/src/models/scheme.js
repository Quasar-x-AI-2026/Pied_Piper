const mongoose = require('mongoose');


const schemeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true,
        index: 'text' 
    },
    ministry: { type: String, default: "Unknown" },
    description: { type: String }, 
    url: { type: String, unique: true },

    
    details: [{ type: String }],            
    benefits: [{ type: String }],           
    eligibility: [{ type: String }],        
    applicationProcess: [{ type: String }], 
    documentsRequired: [{ type: String }],  

    filterMeta: {
        gender: { 
            type: String, 
            enum: ['Male', 'Female', 'Transgender', 'All'], 
            default: 'All' 
        },
        age: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 100 }
        },
        incomeLimit: { type: Number, default: 99999999 },
        state: { type: String, default: "All India" },
        caste: [{ type: String }] 
    },


    tags: [{ type: String }],
    openDate: { type: Date },
    closeDate: { type: Date }

}, { timestamps: true });


schemeSchema.index({ name: 'text', description: 'text', 'filterMeta.state': 1 });

module.exports = mongoose.model('Scheme', schemeSchema);