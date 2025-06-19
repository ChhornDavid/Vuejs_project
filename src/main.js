import { createApp } from 'vue'
import './style.css'
import { createI18n } from 'vue-i18n'
import VueCookies from 'vue-cookies'
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
    welcome: 'Welcome!',
    price: 'Price: {amount} USD'
  },
  km: {
    welcome: 'សូមស្វាគមន៍!',
    price: 'តម្លៃ៖ {amount} ដុល្លារ'
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
app.use(i18n) // make sure this comes after i18n is defined
app.use(VueCookies)
app.use(router)
app.mount('#app')

