<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">Recipient</label>
      <input
        v-model="recipientSearch"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        placeholder="Search by name or phone"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700">Amount</label>
      <input
        v-model="amount"
        type="number"
        min="0.01"
        step="0.01"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        v-model="description"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      ></textarea>
    </div>
    
    <button
      type="submit"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Send Money
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTransactionStore } from '../stores/transactions';

const transactionStore = useTransactionStore();

const recipientSearch = ref('');
const amount = ref<number>(0);
const description = ref('');

async function handleSubmit() {
  try {
    // In a real app, you would first search for and validate the recipient
    const recipientId = 'test-recipient-id'; // This should come from recipient search
    
    await transactionStore.createTransaction({
      recipientId,
      amount: amount.value,
      description: description.value
    });
    
    // Reset form
    recipientSearch.value = '';
    amount.value = 0;
    description.value = '';
  } catch (error) {
    console.error('Transaction failed:', error);
  }
}
</script>