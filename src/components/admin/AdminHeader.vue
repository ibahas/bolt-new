<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <nav class="flex space-x-4">
          <RouterLink 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            class="text-gray-600 hover:text-gray-900"
          >
            {{ item.name }}
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

const navItems = [
  { name: 'Overview', path: '/admin' },
  { name: 'Users', path: '/admin/users' },
  { name: 'Transactions', path: '/admin/transactions' },
  { name: 'Audit Log', path: '/admin/audit' }
];
</script>