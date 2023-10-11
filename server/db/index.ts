import mongoose from 'mongoose'

const config = useRuntimeConfig()

export default async () => {
  mongoose
    .connect(config.MONGO_URI)
    .then(() => console.log('Connected to DB'))
    .catch((e) => console.log('Error connecting to DB', e))
};
