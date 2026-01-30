const SchemeService = require('../services/scheme-service');
const schemeService = new SchemeService();

const getSchemes = async (req, res) => {
    try {
        const schemes = await schemeService.getAllSchemes();
        return res.status(200).json({
            data: schemes,
            success: true,
            message: 'Schemes fetched successfully',
            err: {}
        });
    } catch (error) {
        console.error('Error in getSchemes controller:', error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to fetch schemes',
            err: error
        });
    }
}

const getSchemeById = async (req, res) => {
    try {
        const schemeId = req.params.id;
        const scheme = await schemeService.getSchemeById(schemeId);
        if (!scheme) {
            return res.status(404).json({
                data: {},
                success: false,
                message: 'Scheme not found',
                err: {}
            });
        }
        return res.status(200).json({
            data: scheme,
            success: true,
            message: 'Scheme fetched successfully',
            err: {}
        });
    } catch (error) {
        console.error('Error in getSchemeById controller:', error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to fetch scheme',
            err: error
        });
    }
}

module.exports = {
    getSchemes,
    getSchemeById
};