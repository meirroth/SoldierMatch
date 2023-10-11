
<template>
  <UCard>
    <h1 class="text-center text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">SoldierMatch</h1>
    <h2 class="text-center text-md mb-4 text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
      Enter either soldier or learner name, or both, to create a match.
    </h2>
    <form @submit.prevent="submitForm">
      <div class="space-y-4">
        <div class="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
          <UFormGroup label="Soldier name" name="soldier" size="md" class="w-full sm:w-1/2">
            <UTextarea v-model.trim="soldier" :rows="1" autoresize />
          </UFormGroup>
          <UFormGroup label="Learner name" name="learner" size="md" class="w-full sm:w-1/2">
            <UTextarea v-model.trim="learner" :rows="1" autoresize />
          </UFormGroup>
        </div>
        <UButton type="submit" block size="md" :loading="isLoading">Submit</UButton>
        <p class="text-sm text-center text-gray-400">Separate multiple names with commas or new lines.</p>
      </div>
    </form>
    <p class="text-center text-gray-600 dark:text-gray-300 mt-6">
      Total matches: {{ totalMatches }}<br>
      Soldiers missing a match: {{ soldiersMissingMatch }}<br>
      Learners missing a match: {{ learnersMissingMatch }}<br>
    </p>

    <UModal v-model="isModalOpen">
      <UCard>
        <p class="text-center whitespace-pre-wrap">{{ successMessage }}</p>
      </UCard>
    </UModal>
  </UCard>
</template>

<script lang="ts" setup>
import { IMatch } from '@/types/index'

const toast = useToast()

const { data: matches, refresh } = await useFetch<IMatch[]>('/api/matches')

const soldier = ref('')
const learner = ref('')
const isLoading = ref(false)
const isModalOpen = ref(false)
const successMessage = ref('')

const pairs = computed(() => {
  const soldiers = soldier.value.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
  const learners = learner.value.split(/[\n,]/).map(l => l.trim()).filter(Boolean)
  const maxLength = Math.max(soldiers.length, learners.length)

  return Array.from({ length: maxLength }).map((_, index) => ({
    soldier: soldiers[index] || null,
    learner: learners[index] || null,
  }))
})
const totalMatches = computed(() => {
  return matches.value?.filter(match => match.soldier && match.learner).length || 0
})
const soldiersMissingMatch = computed(() => {
  return matches.value?.filter(match => match.learner === null).length || 0
})
const learnersMissingMatch = computed(() => {
  return matches.value?.filter(match => match.soldier === null).length || 0
})

const submitForm = async () => {
  isLoading.value = true

  if (pairs.value.length === 0) {
    toast.add({ title: 'Please enter a name.', icon: 'i-heroicons-exclamation-triangle', color: 'red' })
    isLoading.value = false
    return
  }

  const successes = []

  for (const pair of pairs.value) {
    try {
      const res: IMatch = await $fetch('/api/matches', {
        method: 'POST',
        body: pair,
      })

      console.log('Match created', res)

      if (pair.soldier && !pair.learner && res.learner) {
        successes.push(`Soldier ${pair.soldier} matched with learner ${res.learner}.`)
      } else if (pair.learner && !pair.soldier && res.soldier) {
        successes.push(`Learner ${pair.learner} matched with soldier ${res.soldier}.`)
      } else if (pair.soldier && pair.learner) {
        successes.push(`Match of ${pair.soldier} and ${pair.learner} submitted.`)
      } else {
        successes.push(`${pair.soldier || pair.learner}  submitted.`)
      }

    } catch (e) {
      console.error(e)
      toast.add({ title: 'There was an error processing your request.', icon: 'i-heroicons-exclamation-circle', color: 'red' })
    }
  }

  if (successes.length) {
    successMessage.value = successes.join('\n')
    isModalOpen.value = true
  }

  soldier.value = ''
  learner.value = ''

  await refresh()
  matches.value = [...matches.value!]
  isLoading.value = false
}
</script>
