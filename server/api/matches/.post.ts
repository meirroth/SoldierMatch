import MatchModel from '@/server/models/Match.model'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { soldier, learner } = body

    if (!soldier && !learner) {
      throw createError('Either soldier or learner value is required.')
    }

    let match

    if (soldier && !learner) {
      // Find a match that needs a soldier
      match = await MatchModel.findOne({ soldier: null })
    } else if (learner && !soldier) {
      // Find a match that needs a learner
      match = await MatchModel.findOne({ learner: null })
    }

    if (match) {
      // Update the match with the provided value
      if (soldier) match.soldier = soldier
      if (learner) match.learner = learner
      await match.save()
      return match
    }

    // If no match is available, create a new one
    const newMatch = await MatchModel.create({
      soldier: soldier || null,
      learner: learner || null,
    })
    return newMatch
  } catch (error) {
    console.error(error)
    throw createError('Internal server error')
  }
})
