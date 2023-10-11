import mongoose, { Document, Model, Schema } from 'mongoose'

const matchSchema = new Schema(
  {
    learner: String,
    soldier: String,
  },
  {
    timestamps: true,
  }
)

interface IMatch extends Document {
  learner?: string
  soldier?: string
}

const Match: Model<IMatch> = mongoose.model<IMatch>('Match', matchSchema)

export default Match
