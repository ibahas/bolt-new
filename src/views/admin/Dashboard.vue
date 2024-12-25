<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader />
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TransactionStats />
        <UserStats />
        <AuditStats />
      </div>
      <div class="mt-8">
        <TransactionList />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/admin/AdminHeader.vue';
import TransactionStats from '@/components/admin/TransactionStats.vue';
import UserStats from '@/components/admin/UserStats.vue';
import AuditStats from '@/components/admin/AuditStats.vue';
import TransactionList from '@/components/admin/TransactionList.vue';
</script>