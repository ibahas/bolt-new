<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900">Transaction Overview</h3>
    <dl class="mt-5 grid grid-cols-1 gap-5">
      <div v-for="item in stats" :key="item.name" class="px-4 py-5 bg-gray-50 rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">{{ item.name }}</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ item.value }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const stats = ref([
  { name: 'Total Transactions', value: '0' },
  { name: 'Pending Approval', value: '0' },
  { name: 'Today\'s Volume', value: '$0' }
]);

onMounted(async () => {
  const data = await adminStore.fetchTransactionStats();
  stats.value = data;
});
</script>