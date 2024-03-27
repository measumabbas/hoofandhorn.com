const Consultation = require("../Models/consultationModel");

exports.createConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.create({
      ...req.body,
      user_id: req.user.userId,
    });

    res.status(200).json({
      message: "Operation successfully done",
      consultation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.getAllConsultations = async (req, res) => {
  const query = {};
  if (req?.query?.status) {
    query.status = req.query.status;
  }
  try {
    const consultations = await Consultation.find(query).populate("user_id");

    res.status(200).json({
      message: "Operation successfully done",
      data: consultations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.getUserConsultations = async (req, res) => {
    const query = {};
    query.user_id = req.user.userId
  if (req?.query?.status) {
    query.status = req.query.status;
  }
  try {
    const consultations = await Consultation.find(query);
    res.status(200).json({
      message: "Operation successfully done",
      data: consultations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.updateConsultation = async (req, res) => {
  try {
    const updated = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.status(200).json({
      message: "Operation successfully done",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.deleteConsultation = async (req, res) => {
  try {
    await Consultation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Operation successfully done",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
