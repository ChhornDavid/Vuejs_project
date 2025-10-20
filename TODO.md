# TODO: Prevent Adding New Order When Any Order is Unpaid

- [x] Modify the "Add New" button disabled condition to check if any order is unpaid
- [x] Update the addNewOrder method to prevent adding if any order is unpaid
- [x] Test the order management functionality
- [x] Fix order_paid not sent to database on payment success
- [x] Ensure "Add New" button remains disabled on logout and login if unpaid orders exist
- [x] Persist orderPaid status in localStorage to survive page refreshes
- [x] Send order_paid: true to database when order is completed
