import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import Components
import Login from './components/Login.vue'
import Dashboard from './components/dashboard/Dashboard.vue'
import Admin from './components/admin/pages/master/Admin.vue'
import Home from './components/admin/pages/master/Home.vue'
import User from './components/admin/pages/master/user/User.vue'
import Menu from './components/admin/pages/master/Menu_Category.vue'
import Food from './components/admin/pages/master/Menu.vue'
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
    size: "SIZE",
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
    user:"User",
    role:"Role",
    status:"Status",
    active:"Active",
    invoice:"Invoice",
    order_history:"Order history",
    current_order:"Current Orders"
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
    user:"អ្នកប្រើប្រាស់",
    role:"តួនាទី",
    status:"ស្ថានភាព",
    active:"សកម្មភាព",
    invoice:"វិក្កយបត្រ",
    order_history:"ប្រវត្តិនៃការកម្មង់",
    current_order:"ការកម្មង់បច្ចុប្បន្ន"
    
  }
}

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
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
    history: createWebHistory(),
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

    const role = sessionStorage.getItem('role');

    if (!allowNavigation) {
        console.log("Navigation cancelled by route guard");
        allowNavigation = true;
        next(false);
        return;
    }
    if (to.meta.requiresAuth) {
        if (!role) {
            console.log('User not authenticated. Redirecting to login.');
            next('/');
        } else if (to.meta.roles && !to.meta.roles.includes(role)) {
            console.log(`Role '${role}' is not authorized for this route.`);
            next('/unauthorized');
        } else {
            next();
        }
    } else {
        next();
    }
});


// Create App Instance
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon) 
app.use(router)
app.use(i18n)
app.mount('#app')

