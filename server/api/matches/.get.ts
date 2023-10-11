import MatchModel from '@/server/models/Match.model'

export default defineEventHandler(async (event) => {
  // return all matches
  return await MatchModel.find()
})
