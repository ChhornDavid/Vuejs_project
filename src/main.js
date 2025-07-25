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
        ordering:"Ordering",
        tablenumber: "TableNumer",
        cash: "Cash",
        card: "Card",
        itemname: "Ttem.name",
        e_pay: "E_Pay",
        kh: "khmer",
        en: "English",
        paid_here: "Paid here",
        add_category:"Add Category",
        category_management:"Category Management",
        total_category:"total_category",
        show:"Show:",
        id:"ID",
        name:"Name",
        image:"Image",
        actions:"Actions",
        category_name:"Catrgory Name",
        no_categories_found:'No categories found',
        search_categories:"Search categories",
        menu_management:"Menu Management",
        add_menu:"Add menu",
        dashboard: 'Dashboard',
        orders:"Order",
        special_menu:"Special Menu",
        menu_category:"Menu Category",
        menu:"Menu",
        user:"User",
        food:"Food",
        user_management:"User Management",
        add_user:"Add user",
        role:"Role",
        status:"Status",
        active:"Active",
        invoice:"Invoice",
        order_history:"Order history",
        current_order:"Current Orders",
        special_menu_management:"Special Menu Management",
        add_new_menu:"Add New Menu",
        search_menu:"Search Menu",
        menu_name:"Menu Name",
        total_items:"Total Items",
        available_item:"Available Items",
        categries:"Categories",
        search_item:"Search Items",
        items:"Items",
        category:"Category",
        rating:"Rating",
        all_categories:"All Categories",
        all_status:"All Status",
        available:"Available",
        unavailable:"Unvailable",
        pending_order:"Pending Orders",
        no_pending_order:"No Pending Order",
        pending:"Pending",
        size:"Size",
        qty:"Qty",
        price:"Price",
        accept:"Accept",
        decline:"Decline",
        cancel:"Cancel",
        confirm:"Confirm",
        admin:"Admin"
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
        add_category:"បន្ថែមប្រភេទម៉ឺនុយថ្មី",
        category_management:"ការគ្រប់គ្រងប្រភេទនៃម៉ឺនុយ",
        total_category:"ម៉ឺនុយសរុប",
        show:"បង្ហាញៈ",
        id:"លេខ",
        name:"ឈ្មោះ",
        image:"រូបភាព",
        actions:"មុខងារ",
        category_name:"ឈ្មោះ ម៉ឺនុយ",
        no_categories_found:'រកមិនឃើញម៉ឺនុយទេ',
        search_categories:"ស្វែងរកប្រភេទម៉ឺនុយ",
        menu_management:"ការគ្រប់គ្រងម៉ឺនុយ",
        add_menu:"បន្ថែមម៉ឺនុយថ្មី",
        dashboard: 'ផ្ទាំងគ្រប់គ្រង',
        orders:"ការកម្មង់",
        special_menu:"ម៉ឺនុយពិសេស",
        menu_category:"ប្រភេទនៃម៉ឺនុយ",
        menu:"ម៉ឺនុយ",
        user:"អ្នកប្រើប្រាស់",
        food:"អាហារ",
        user_management:"ការគ្រប់គ្រងអ្នកប្រើប្រាស់",
        add_user:"បញ្ចូលអ្នកប្រើប្រាស់ថ្មី",
        role:"តួនាទី",
        status:"ស្ថានភាព",
        active:"សកម្មភាព",
        invoice:"វិក្កយបត្រ",
        order_history:"ប្រវត្តិនៃការកម្មង់",
        current_order:"ការកម្មង់បច្ចុប្បន្ន",
        special_menu_management:"ការគ្រប់គ្រងម៉ឺនុយពិសេស",
        add_new_menu:"បន្ថែមម៉ឺនុយថ្មី",
        search_menu:"ស្វែងរកម៉ឺនុយ",
        menu_name:"ឈ្មោះម៉ឺនុយ",
        total_items:"ម៉ឺនុយសរុប",
        available_item:"ម៉ឺនុយដែលមាន",
        categries:"ប្រភេទនៃម៉ឺនុយ",
        search_item:"ស្វែងរកម៉ឺនុយ",
        items:"អាហារ",
        category:"ប្រភេទ",
        price:"តម្លៃ",
        rating:"ការវាយតម្លៃ",
        all_categories:"ប្រភេទទាំងអស់",
        all_status:"ស្ថានភាពទាំងអស់",
        available:"មាន",
        unavailable:"មិនមាន",
        pending_order:"ការកម្មង់ស្ថិតក្នងការរងចាំ",
        no_pending_order:"គ្មានការរង់ចាំការកម្មង់",
        pending:"រងចាំ",
        qty:"ចំនួន",
        accept:"ទទួល",
        decline:"បដិសេធ",
        cancel:"លុបចោល",
        confirm:"បញ្ជាក់",
        admin:"អ្នកគ្រប់គ្រង"

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

router.beforeEach((to, _from, next) => {
  const role = sessionStorage.getItem('role') || localStorage.getItem('role');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // If trying to access Login and already logged in, redirect to role-based route
  if (to.name === 'Login' && isLoggedIn && role) {
    const redirectPath =
      role === 'admin' ? '/admin' :
      role === 'cooker' ? '/kitchen' :
      '/dashboard';

    return next(redirectPath); // ✅ auto redirect
  }

  // Protect auth routes
  if (to.meta.requiresAuth) {
    if (!role) {
      return next('/');
    } else if (to.meta.roles && !to.meta.roles.includes(role)) {
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

