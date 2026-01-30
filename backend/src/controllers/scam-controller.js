const ScamService = require('../services/scam-service');
const scamService = new ScamService();

const reportScam = async (req, res) => {
    try {
        const data = req.body;
        const scamReport = await scamService.reportScam(data);
        res.status(201).json({
            data: scamReport,
            success: true,
            message: 'Scam reported successfully',
            err: {}
        });
    } catch (error) {
        console.log('Error in reportScam:', error);
        res.status(500).json({
            data: {},
            success: false,
            message: 'Internal server error',
            err: error
        });
    }
}

const getAllScamReports = async (req, res) => {
    try {
        const scamReports = await scamService.getAllScamReports();
        res.status(200).json({
            data: scamReports,
            success: true,
            message: 'Scam reports fetched successfully',
            err: {}
        });
    } catch (error) {
        console.log('Error in getAllScamReports:', error);
        res.status(500).json({
            data: {},
            success: false,
            message: 'Internal server error',
            err: error
        });
    }
}

const getScamReportById = async (req, res) => {
    try {
        const reportId = req.params.id;
        const scamReport = await scamService.getScamReportById(reportId);
        if (!scamReport) {
            return res.status(404).json({
                data: {},
                success: false,
                message: 'Scam report not found',
                err: {}
            });
        }
        res.status(200).json({
            data: scamReport,
            success: true,
            message: 'Scam report fetched successfully',
            err: {}
        });
    } catch (error) {
        console.log('Error in getScamReportById:', error);
        res.status(500).json({
            data: {},
            success: false,
            message: 'Internal server error',
            err: error
        });
    }
}

module.exports = {
    reportScam,
    getAllScamReports,
    getScamReportById
};