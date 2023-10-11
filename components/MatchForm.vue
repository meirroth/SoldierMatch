
<template>
  <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
    <h1 class="text-center text-2xl font-semibold mb-2 text-gray-800">SoldierMatch</h1>
    <h2 class="text-center text-md mb-4 text-gray-600">
      Enter either soldier or learner name, or both, <br> to create a match.
    </h2>
    <form @submit.prevent="submitForm">
      <div class="space-y-4">
        <div class="flex space-x-4">
          <div class="w-1/2">
            <label for="soldier" class="block text-gray-600 text-sm font-medium">
              Soldier name
            </label>
            <input v-model.trim="soldier" type="text" id="soldier" name="soldier"
              class="w-full p-2 border rounded-lg focus:ring focus:border-indigo-300" />
          </div>
          <div class="w-1/2">
            <label for="learner" class="block text-gray-600 text-sm font-medium">
              Learner name
            </label>
            <input v-model.trim="learner" type="text" id="learner" name="learner"
              class="w-full p-2 border rounded-lg focus:ring focus:border-indigo-300" />
          </div>
        </div>
        <button type="submit" class="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
          {{ isLoading ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
    </form>
    <p class="text-center text-gray-600 mt-6">
      Total matches: {{ matches?.filter(match => match.soldier && match.learner).length }}<br>
      Soldiers missing a match: {{ matches?.filter(match => match.learner === null).length }}<br>
      Learners missing a match: {{ matches?.filter(match => match.soldier === null).length }}<br>
    </p>
  </div>
</template>

<script lang="ts" setup>

const toast = useToast()

const { data: matches, refresh } = await useFetch('/api/matches')

const soldier = ref('')
const learner = ref('')
const isLoading = ref(false)

const submitForm = async () => {
  isLoading.value = true

  if (!soldier.value && !learner.value) {
    toast.add({ title: 'Please enter a name.', icon: '', color: 'red' })
    isLoading.value = false
    return
  }


  try {
    const res = await $fetch('/api/matches', {
      method: 'POST',
      body: { soldier: soldier.value, learner: learner.value },
    })
    soldier.value = ''
    learner.value = ''
    toast.add({ title: 'Form submitted!', icon: '', color: 'green' })
    console.log('Match created', res)

    await refresh()
  } catch (e) {
    console.error(e)
    toast.add({ title: 'There was an error processing your request.', icon: '', color: 'red' })
  } finally {
    isLoading.value = false
  }
}
</script>
