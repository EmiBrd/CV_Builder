import mongoose, { ConnectOptions } from 'mongoose';

const MONGO_URL =
	'mongodb+srv://emibordeianu1999:7X97jxPNQgl8Qeo8@bordeianucluster.l9nqlrm.mongodb.net/?retryWrites=true&w=majority';

async function connectToDb() {
	mongoose.set('strictQuery', true);

	mongoose
		.connect(MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		} as ConnectOptions)
		.then(() => {
			console.log('Successfully connected to MongoDB');
		})
		.catch((error) => {
			console.error('Error connecting to MongoDB:', error);
		});
}

export default connectToDb;
