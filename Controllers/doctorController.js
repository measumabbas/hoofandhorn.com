const Doctor = require('../Models/doctorsModel')
exports.doctorRequest = async (req, res) => {
  try {

    console.log(req.body)
    const doctor = await Doctor.create(req.body);

    res.status(200).json({
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Operation successfull",
      updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const { status } = req.query;

    const doctors = await Doctor.find({ status });

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
        message: "Internal server error",
      });
  }
};
exports.deleteDoctor = async (req, res) => {
  try {
    

    await Doctor.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
        message: "Internal server error",
      });
  }
};
