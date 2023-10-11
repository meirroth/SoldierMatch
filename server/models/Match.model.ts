import mongoose, { Model, Schema } from 'mongoose'
import { IMatch } from '@/types/index'

const matchSchema = new Schema(
  {
    learner: String,
    soldier: String,
  },
  {
    timestamps: true,
  }
)

const Match: Model<IMatch> = mongoose.model<IMatch>('Match', matchSchema)

export default Match
