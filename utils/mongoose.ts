import {connect, connection} from 'mongoose';


const conn = {
    isConnected: false
}


export async function connectDB() {


    if (conn.isConnected) return;

    const db = await connect(process.env.MONGODB_URI!)
    console.log(`MongoDB connected: ${db.connection.host}`);
    conn.isConnected = db.connections[0].readyState === 1;

}


connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
});


connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});





// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI!;

// if (!MONGODB_URI) {
//   throw new Error("Define la variable MONGODB_URI en el entorno");
// }

// // Declaración global segura para evitar errores TS en entornos serverless
// declare global {
//   var _mongoose: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   };
// }

// const globalWithMongoose = globalThis as typeof globalThis & {
//   _mongoose?: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   };
// };

// if (!globalWithMongoose._mongoose) {
//   globalWithMongoose._mongoose = { conn: null, promise: null };
// }

// export async function connectDB(): Promise<typeof mongoose> {
//   if (globalWithMongoose._mongoose!.conn) {
//     return globalWithMongoose._mongoose!.conn;
//   }

//   if (!globalWithMongoose._mongoose!.promise) {
//     globalWithMongoose._mongoose!.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//     });
//   }

//   globalWithMongoose._mongoose!.conn = await globalWithMongoose._mongoose!.promise;
//   return globalWithMongoose._mongoose!.conn;
// }
