<template>
    <section>
      <table class="w-full bg-white shadow-md border rounded-lg overflow-hidden">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left bg-blue-500 font-semibold text-white">Order ID</th>
            <th class="p-3 text-left bg-blue-500 font-semibold text-white">Table</th>
            <th class="p-3 text-left bg-blue-500 font-semibold text-white">Time</th>
            <th class="p-3 text-left bg-blue-500 font-semibold text-white">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="history in histories"
            :key="history.id"
            class="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
          >
            <td class="p-3">{{ history.id }}</td>
            <td class="p-3">{{ history.table }}</td>
            <td class="p-3">{{ history.time }}</td>
            <td class="p-3 text-sm" :class="statusColor(history.status)">
              {{ history.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        histories: [
          { id: "001", table: "T01", time: "10:30 AM", status: "Complete" },
          { id: "002", table: "T02", time: "11:15 AM", status: "Complete" },
          { id: "003", table: "T03", time: "11:45 AM", status: "On Cook" },
          { id: "004", table: "T04", time: "12:20 PM", status: "New Order" },
          { id: "005", table: "T05", time: "01:00 PM", status: "Complete" },
         
        ],
      };
    },
    methods: {
      statusColor(status) {
        switch (status) {
          case "Complete":
            return "text-green-500";
          case "On Cook":
            return "text-yellow-500";
          default:
            return "text-blue-500";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  </style>