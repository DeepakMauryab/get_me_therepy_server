import mongoose from "mongoose";

// mongoose.connect(process.env.DATABASEURI).then(() => {});

const dataBaseConnection = async () => {
  try {
    const dbInstance = await mongoose.connect(process.env.DATABASEURI);
    console.log("Database Connected At:", dbInstance.connection.host);
  } catch (error) {
    console.log("Database connection error:", error);
    process.exit(1);
  }
};

export default dataBaseConnection;
