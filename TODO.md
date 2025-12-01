# Fix Order Status Update Issue

## Problem
Status changes for orders only update when that order is the active one. When viewing Order1, Order2's status doesn't update in real-time.

## Solution
Modify status update listeners in Dashboard.vue to update the specific order by order_number instead of only the activeOrder.

## Tasks
- [ ] Update listenForOrderApprove to find and update order by order_number
- [ ] Update listenForKitchenStatus to find and update order by order_number
- [ ] Update listenCreditForStatus to find and update order by order_number
- [ ] Update listenForCallRobot to find and update order by order_number (already checks orderNumber but updates activeOrder)
- [ ] Test the changes to ensure all orders update their status in real-time
