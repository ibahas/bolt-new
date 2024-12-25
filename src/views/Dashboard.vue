<!-- Dashboard.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { useTransactionStore } from '../stores/transactions';
import { useAuthStore } from '../stores/auth';

const transactionStore = useTransactionStore();
const authStore = useAuthStore();

onMounted(() => {
  transactionStore.loadUserTransactions();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Add dashboard content here -->
    </main>
  </div>
</template>