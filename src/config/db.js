const { Sequelize } = require("sequelize");
const env = require("./env");

const sequelize = new Sequelize(env.dbUrl, {
  dialect: "postgres",
  logging: env.nodeEnv === "development" ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
});

const connectDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync({
    alter: env.nodeEnv === "development"
  });
  console.log("Database connected successfully");
};

module.exports = connectDB;
module.exports.sequelize = sequelize;
