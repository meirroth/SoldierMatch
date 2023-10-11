
<template>
  <UCard>
    <h1 class="text-center text-2xl font-semibold mb-2 text-gray-800">SoldierMatch</h1>
    <h2 class="text-center text-md mb-4 text-gray-600">
      Enter either soldier or learner name, or both, <br> to create a match.
    </h2>
    <form @submit.prevent="submitForm">
      <div class="space-y-4">
        <div class="flex space-x-4">
          <UFormGroup label="Soldier name" name="soldier" size="md" class="w-1/2">
            <UInput v-model.trim="soldier" />
          </UFormGroup>
          <UFormGroup label="Learner name" name="learner" size="md" class="w-1/2">
            <UInput v-model.trim="learner" />
          </UFormGroup>
        </div>
        <UButton type="submit" block size="md" :loading="isLoading">Submit</UButton>
      </div>
    </form>
    <p class="text-center text-gray-600 mt-6">
      Total matches: {{ matches?.filter(match => match.soldier && match.learner).length }}<br>
      Soldiers missing a match: {{ matches?.filter(match => match.learner === null).length }}<br>
      Learners missing a match: {{ matches?.filter(match => match.soldier === null).length }}<br>
    </p>

    <UModal v-model="isModalOpen">
      <UCard>
        <p class="text-center">{{ successMessage }}</p>
      </UCard>
    </UModal>
  </UCard>
</template>

<script lang="ts" setup>
const toast = useToast()

const { data: matches, refresh } = await useFetch('/api/matches')

const soldier = ref('')
const learner = ref('')
const isLoading = ref(false)
const isModalOpen = ref(false)
const successMessage = ref('')

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

    toast.add({ title: 'Form submitted!', icon: '', color: 'green' })
    console.log('Match created', res)

    if (soldier.value && !learner.value && res.learner) {
      successMessage.value = `Soldier ${soldier.value} matched with learner ${res.learner}!`
      isModalOpen.value = true
    } else if (learner.value && !soldier.value && res.soldier) {
      successMessage.value = `Learner ${learner.value} matched with soldier ${res.soldier}!`
      isModalOpen.value = true
    }

    soldier.value = ''
    learner.value = ''

    await refresh()
  } catch (e) {
    console.error(e)
    toast.add({ title: 'There was an error processing your request.', icon: '', color: 'red' })
  } finally {
    isLoading.value = false
  }
}
</script>
