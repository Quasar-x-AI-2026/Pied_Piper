const Scheme = require('../models/Scheme');

exports.getSchemes = async (req, res) => {
  try {
    const {
      search,
      state,
      gender,
      minAge,
      maxAge
    } = req.query;

    const query = {};


    if (search) {
      query.$text = { $search: search };
    }

    
    if (state && state !== 'All India') {
      query['filterMeta.state'] = state;
    }


    if (gender && gender !== 'All') {
      query['filterMeta.gender'] = { $in: [gender, 'All'] };
    }

    
    if (minAge || maxAge) {
      query['filterMeta.age.min'] = { $lte: maxAge ?? 100 };
      query['filterMeta.age.max'] = { $gte: minAge ?? 0 };
    }

    const schemes = await Scheme.find(query).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: schemes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

