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