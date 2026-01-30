const CrudService = require('./crud-service');
const ScamRepository = require('../repositories/scam-repo');
const axios = require('axios');

class ScamService extends CrudService {
    constructor() {
        const scamRepository = new ScamRepository();
        super(scamRepository);
    }
    async createScamReport(data) {
        try {
            const aiResponse = await axios.post('https://project-jan-3.onrender.com/query', {
                query: `Analyze this scam message: "${data.message}". Is it a scam? Provide a brief explanation.`,
                user_id:  data.userId
            });
            const analysis = aiResponse.data.response;
            const riskMatch = analysis.match(/\*\*Risk Level:\*\*\s*([A-Z]+)/i);
            let riskLevel = riskMatch? riskMatch[1].toUpperCase() : 'MEDIUM'; 
            const confMatch = aiText.match(/\*\*Confidence:\*\*\s*(\d+)%/);
            let confidence = confMatch ? parseInt(confMatch[1]) : 0;
            const scamTypeMatch = analysis.match(/\*\*Scam Type:\*\*\s*(.+)/);
            let scamType = scamTypeMatch ? scamTypeMatch[1].trim() : 'Other';
            const typeLower = scamType.toLowerCase();
        
        if (typeLower.includes('phishing')) scamType = 'Phishing';
        else if (typeLower.includes('lottery')) scamType = 'Lottery Scam';
        else if (typeLower.includes('investment')) scamType = 'Investment Fraud';
        else if (typeLower.includes('romance')) scamType = 'Romance Scam';
        else if (typeLower.includes('tech')) scamType = 'Tech Support Scam';
        else if (typeLower.includes('charity')) scamType = 'Charity Fraud';
        else if (typeLower.includes('identity')) scamType = 'Identity Theft';
        else if (typeLower.includes('kyc')) scamType = 'KYC update scam';
        else scamType = 'Other';

        const redFlags = [];
        const lines = aiText.split('\n');
        let capturingFlags = false;
        
        for (const line of lines) {
            if (line.includes('Red Flags Detected')) {
                capturingFlags = true;
                continue;
            }
            if (capturingFlags) {
                if (line.trim() === '' || line.includes('Recommendation')) break; // Stop if section ends
                if (line.includes('•') || line.trim().startsWith('-')) {
                    // Clean the bullet point text
                    redFlags.push(line.replace(/[•-]/g, '').trim());
                }
            }
        }

        const recMatch = aiText.match(/\*\*💡 Recommendation:\*\*\s*\n(.+)/);
        let recommendation = recMatch ? recMatch[1].trim() : "Exercise caution.";

        const scamReportData = {
            scamType,
            message: data.message,
            reportedBy: data.userId,
            riskLevel,
            confidence,
            recommendation
        };
        const scamReport = await this.repo.create(scamReportData);
        return scamReport;

        } catch (error) {
            console.error('Error in createScamReport:', error);
            throw error;
        }
    }

    async getScamReportsByUser(userId) {
        try {
            const scamReports = await this.repo.getAll({ reportedBy: userId });
            return scamReports;
        } catch (error) {
            console.error('Error in getScamReportsByUser:', error);
            throw error;
        }
    }

    async getScamReportById(reportId) {
        try {
            const scamReport = await this.repo.get({ _id: reportId });
            return scamReport;
        } catch (error) {
            console.error('Error in getScamReportById:', error);
            throw error;
        }
    }

    async getAllScamReports() {
        try {
            const scamReports = await this.repo.getAll({});
            return scamReports;
        } catch (error) {
            console.error('Error in getAllScamReports:', error);
            throw error;
        }
    }

    async deleteScamReport(reportId) {
        try {
            const result = await this.repo.delete(reportId);
            return result;
        } catch (error) {
            console.error('Error in deleteScamReport:', error);
            throw error;
        }
    }

}

module.exports = ScamService;






