const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: { type: Date, required: true },
    updated_on: { type: Date, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: "" },
    open: { type: Boolean, default: true },
    status_text: { type: String, default: "" }
  },
  { versionKey: false }
);
