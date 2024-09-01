const mongoose = require("mongoose");


const roleShecma = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: Array,
      default: []
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  }, {
  timestamps: true
}
);

const Role = mongoose.model("Role", roleShecma, "roles");

module.exports = Role;