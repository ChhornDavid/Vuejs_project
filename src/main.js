import { createApp } from 'vue'
import './style.css'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import Components
import Login from './components/Login.vue'
import Dashboard from './components/dashboard/Dashboard.vue'
import Admin from './components/admin/pages/master/Admin.vue'
import Home from './components/admin/pages/master/Home.vue'
import User from './components/admin/pages/master/user/User.vue'
import Menu from './components/admin/pages/master/Menu.vue'
import Food from './components/admin/pages/master/Food.vue'
import SpecialMenu from './components/admin/pages/master/SpecialMenu.vue'
import Unauthorized from './components/Authorized/Unauthorized.vue'
import NotFound from './components/Authorized/NotFound.vue'
import OrderHistory from './components/admin/pages/master/order/OrderHistory.vue'
import Order from './components/admin/pages/master/order/Order.vue'

// Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';
import Invoice from './components/admin/pages/master/order/Invoice.vue'
import Kithchen from './components/kitchen/Kithchen.vue'
import Test from './components/Test.vue'

const messages = {
    en: {
        restaurant: "Restaurant",
        menuCategories: "Menu Categories",
        allItems: "All Items",
        addToOrder: "Add to Order",
        orderItems: "ORDER ITEMS",
        total: "Total",
        tax: "Tax (10%)",
        subtotal: "Subtotal",
        yourOrderEmpty: "Your order is empty",
        addItemsFromMenu: "Add items from the menu",
        logout: "Logout",
        language: "Language",
        khmer: "Khmer",
        english: "English",
        ordering: "Ordering",
        tablenumber: "TableNumer",
        cash: "Cash",
        card: "Card",
        itemname: "Ttem.name",
        e_pay: "E_Pay",
        kh: "khmer",
        en: "English",
        paid_here: "Paid here",
        add_category: "Add Category",
        category_management: "Category Management",
        total_category: "total_category",
        show: "Show:",
        id: "ID",
        name: "Name",
        image: "Image",
        actions: "Actions",
        category_name: "Catrgory Name",
        no_categories_found: 'No categories found',
        search_categories: "Search categories",
        menu_management: "Menu Management",
        add_menu: "Add menu",
        dashboard: 'Dashboard',
        orders: "Order",
        special_menu: "Special Menu",
        menu_category: "Menu Category",
        menu: "Menu",
        user: "User",
        food: "Food",
        user_management: "User Management",
        add_user: "Add user",
        role: "Role",
        status: "Status",
        active: "Active",
        invoice: "Invoice",
        order_history: "Order history",
        current_order: "Current Orders",
        special_menu_management: "Special Menu Management",
        add_new_menu: "Add New Menu",
        search_menu: "Search Menu",
        menu_name: "Menu Name",
        total_items: "Total Items",
        available_item: "Available Items",
        categries: "Categories",
        search_item: "Search Items",
        items: "Items",
        category: "Category",
        rating: "Rating",
        all_categories: "All Categories",
        all_status: "All Status",
        available: "Available",
        unavailable: "Unvailable",
        pending_order: "Pending Orders",
        no_pending_order: "No Pending Order",
        pending: "Pending",
        size: "Size",
        qty: "Qty",
        price: "Price",
        accept: "Accept",
        decline: "Decline",
        cancel: "Cancel",
        confirm: "Confirm",
        admin: "Admin",
        full_name:"Full Name",
        email:"Email",
        user_role:" User Role",
        cooker:"Cooker",
        create_password:"Create Password",
        enter_password:"Enter Password",
        cancel:"Cancel", 
        create_user:"Create User",
        save_changes:"Save Changes",
        change_password:"Change Password",
        account_created:"Account Created",
        email_verification:"Email Verification",
        account_status:"Account Status",
        close:"Close",
        confirm_user_deletion:"Confirm User Delection",
        are_you_sure:"Are you sure you want to remove ",
        from_the_system:"from the system?",
        delete_user:"Delete User",
        showing:"Showing",
        to:"to",
        of:"of",
        results:"results",
        five_per_page:"5 per page",
        ten_per_page:"10 per page",
        twenty_per_page:"20 per page",
        fifty_per_page:"50 per page",
        delete:"Delete",
        created_at:"CREATED AT",
        updated_at:"UPDATED AT",
        upload_image:"Upload Image",
        item_name:"Item Name",
        select_category:"Select Category",
        select_special_menu:"Select Specail Menu",
        small:"Small",
        medium:"Medium",
        large:"Large",
        rating:"Rating",
        description:"Description",
        food_image:"Food image",
        create_item:"Create Item",
        category_image:"Category Image",
        click_to_upload_an_image:"Click to upload an image",
        
    },
    kh: {
        restaurant: "ភោជនីយដ្ឋាន",
        menuCategories: "ប្រភេទម៉ឺនុយ",
        allItems: "ម៉ឺនុយទាំងអស់",
        addToOrder: "កម្មង់",
        orderItems: "មុខម្ហូបបានទិញ",
        size: "ទំហំ",
        total: "សរុប",
        tax: "ពន្ធ (១០%)",
        subtotal: "សរុប",
        yourOrderEmpty: "មិនទាន់មានការបញ្ជាទិញ",
        addItemsFromMenu: "បន្ថែមមុខម្ហូបពីម៉ឺនុយ",
        logout: "ចាកចេញ",
        language: "ភាសា",
        khmer: "ខ្មែរ",
        english: "អង់គ្លេស",
        ordering: "ការកម្មង់",
        tablenumber: "តុលេខ",
        cash: "សាច់ប្រាក់",
        card: "កាត",
        e_pay: "ការទូទាត់តាមអេឡិចត្រូនិក",
        kh: "ភាសាខ្មែរ",
        en: "ភាសាអង់គ្លេស",
        paid_here: "បង់នៅទីនេះ",
        add_category: "បន្ថែមប្រភេទម៉ឺនុយថ្មី",
        category_management: "ការគ្រប់គ្រងប្រភេទនៃម៉ឺនុយ",
        total_category: "ម៉ឺនុយសរុប",
        show: "បង្ហាញៈ",
        id: "លេខ",
        name: "ឈ្មោះ",
        image: "រូបភាព",
        actions: "មុខងារ",
        category_name: "ឈ្មោះ ម៉ឺនុយ",
        no_categories_found: 'រកមិនឃើញម៉ឺនុយទេ',
        search_categories: "ស្វែងរកប្រភេទម៉ឺនុយ",
        menu_management: "ការគ្រប់គ្រងម៉ឺនុយ",
        add_menu: "បន្ថែមម៉ឺនុយថ្មី",
        dashboard: 'ផ្ទាំងគ្រប់គ្រង',
        orders: "ការកម្មង់",
        special_menu: "ម៉ឺនុយពិសេស",
        menu_category: "ប្រភេទនៃម៉ឺនុយ",
        menu: "ម៉ឺនុយ",
        user: "អ្នកប្រើប្រាស់",
        food: "អាហារ",
        user_management: "ការគ្រប់គ្រងអ្នកប្រើប្រាស់",
        add_user: "បញ្ចូលអ្នកប្រើប្រាស់ថ្មី",
        role: "តួនាទី",
        status: "ស្ថានភាព",
        active: "សកម្មភាព",
        invoice: "វិក្កយបត្រ",
        order_history: "ប្រវត្តិនៃការកម្មង់",
        current_order: "ការកម្មង់បច្ចុប្បន្ន",
        special_menu_management: "ការគ្រប់គ្រងម៉ឺនុយពិសេស",
        add_new_menu: "បន្ថែមម៉ឺនុយថ្មី",
        search_menu: "ស្វែងរកម៉ឺនុយ",
        menu_name: "ឈ្មោះម៉ឺនុយ",
        total_items: "ម៉ឺនុយសរុប",
        available_item: "ម៉ឺនុយដែលមាន",
        categries: "ប្រភេទនៃម៉ឺនុយ",
        search_item: "ស្វែងរកម៉ឺនុយ",
        items: "អាហារ",
        category: "ប្រភេទ",
        price: "តម្លៃ",
        rating: "ការវាយតម្លៃ",
        all_categories: "ប្រភេទទាំងអស់",
        all_status: "ស្ថានភាពទាំងអស់",
        available: "មាន",
        unavailable: "មិនមាន",
        pending_order: "ការកម្មង់ស្ថិតក្នងការរងចាំ",
        no_pending_order: "គ្មានការរង់ចាំការកម្មង់",
        pending: "រងចាំ",
        qty: "ចំនួន",
        accept: "ទទួល",
        decline: "បដិសេធ",
        cancel: "បោះបង់ចោល",
        confirm: "បញ្ជាក់",
        admin: "អ្នកគ្រប់គ្រង",
        full_name:"ឈ្មោះពេញ",
        email:"អ៊ីមែល",
        user_role:"តួនាទីអ្នកប្រើប្រាស់",
        cooker:"អ្នកចំអិន",
        create_password:"បង្កើតលេខកូដសម្ងាត់",
        enter_password:"បញ្ចូលពាក្យសម្ងាត់",
        cancel:"បោះបង់",
        create_user:"បង្កើតអ្នកប្រើប្រាស់ថ្មី",
        save_changes:"រក្សាទុកការផ្លាស់ប្តូរ",
        change_password:"ផ្លាស់ប្ដូរពាក្យសម្ងាត់",
        account_created:"គណនីបានបង្កើត",
        email_verification:"ការផ្ទៀងផ្ទាត់អ៊ីមែល",
        account_status:"ស្ថានភាពគណី",
        close:"បិទ",
        confirm_user_deletion:"បញ្ជាក់ការជ្រើសរើសអ្នកប្រើប្រាស់",
        are_you_sure :"តើអ្នកប្រាកដជាចង់លុប",
        from_the_system:"ចេញពីប្រព័ន្ធ?",
        delete_user:"លុបអ្នកប្រើប្រាស់",
        showing:"បង្ហាញ",
        to:"ដល់",
        of:"នៃ",
        results:"លទ្ធផល",
        five_per_page:"៥ក្នុងមួយទំព័រ",
        ten_per_page:"១០ក្នុងមួយទំព័រ",
        twenty_per_page:"២០ក្នុងមួយទំព័រ",
        fifty_per_page:"៥០ក្នុងមួយទំព័រ",
        delete:"លុប",
        created_at:"បង្កើតនៅ",
        updated_at:"កែប្រែនៅ",
        upload_image:"បញ្ចូលរូបភាព",
        item_name:"ឈ្មោះធាតុ",
        select_category:"ជ្រើសរើសប្រភេទ",
        select_special_menu:"ជ្រើសរើសម៉ឺនុយពិសេស",
        small:"តូច",
        medium:"កណ្ដាល",
        large:"ធំ",
        rating:"ការវាយតម្លៃ",
        description:"ការពិពណ៏នា",
        food_image:"រូបភាព",
        create_item:"បង្កើត",
        category_image:"រូបភាព",
        click_to_upload_an_image:"ចុចដើម្បីបញ្ចូលរូបភាព",
        

    }
}


const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages
})
// Define Routes
const routes = [
    {
        path: '/',
        component: Login,
        name: 'Login',
    },
    {
        path: '/test',
        component: Test,
        name: 'Test',
    },
    {
        path: '/dashboard',
        component: Dashboard,
        name: 'Dashboard',
        meta: { requiresAuth: true, roles: ['user', 'admin'] }
    },
    {
        path: '/kitchen',
        component: Kithchen,
        name: 'Kitchen',
        meta: { requiresAuth: true, roles: ['cooker', 'admin'] }
    },
    {
        path: '/admin',
        component: Admin,
        name: 'Admin',
        meta: { requiresAuth: true, roles: ['admin'] },
        children: [
            {
                path: 'home',
                component: Home,
                name: 'Home',
                meta: { requiresAuth: true, roles: ['admin'] },
            },
            {
                path: 'specialmenu',
                component: SpecialMenu,
                name: 'SpecialMenu',
                meta: { requiresAuth: true, roles: ['admin'] },
            },
            {
                path: 'user',
                component: User,
                name: 'User',
                meta: { requiresAuth: true, roles: ['admin'] },
            },
            {
                path: 'menu',
                component: Menu,
                name: 'Menu',
                meta: { requiresAuth: true, roles: ['admin'] },
            },
            {
                path: 'food',
                component: Food,
                name: 'Food',
                meta: { requiresAuth: true, roles: ['admin'] },
            },
            {
                path: 'order',
                component: Order,
                name: 'Order',
                meta: { requiresAuth: true, roles: ['admin'] },
            },
            {
                path: 'orderHistory',
                component: OrderHistory,
                name: 'OrderHistory',
                meta: { requiresAuth: true, roles: ['admin'] },
            },
            {
                path: 'invoice',
                component: Invoice,
                name: 'Invoice',
                meta: { requiresAuth: true, role: ['admin'] },
            }
        ]
    },
    {
        path: '/unauthorized',
        component: Unauthorized,
        name: 'Unauthorized'
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound,
        name: 'NotFound'
    }
]

// Create Router
const router = createRouter({
    history: createWebHistory('/'),
    routes: routes
})

let allowNavigation = true;

// Function to allow navigation
export const allowRouteNavigation = () => {
    allowNavigation = true;
    router.push(router.currentRoute);
};

// Function to deny navigation
export const preventRouteNavigation = () => {
    allowNavigation = false;
};

router.beforeEach((to, from, next) => {
  const role = sessionStorage.getItem('role') || localStorage.getItem('role');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Save attempted route before login
  if (!isLoggedIn && to.meta.requiresAuth) {
    sessionStorage.setItem('redirectAfterLogin', to.fullPath);
  }

  // Redirect away from login page if already logged in
  if (to.path === '/' && isLoggedIn && role) {
    return next(false); // Stay where you are if refreshing, no forced redirect
  }

  // Auth protection
  if (to.meta.requiresAuth) {
    if (!role) return next('/');
    if (to.meta.roles && !to.meta.roles.includes(role)) {
      return next('/unauthorized');
    }
  }

  next();
});



// Create App Instance
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(i18n) // make sure this comes after i18n is defined
app.use(router)
app.mount('#app')

