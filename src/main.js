import { createApp } from 'vue'
import './style.css'
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
import Item from './components/dashboard/Item.vue'
import SpecialMenu from './components/admin/pages/master/SpecialMenu.vue'
import Unauthorized from './components/Authorized/Unauthorized.vue'
import NotFound from './components/Authorized/NotFound.vue'

// Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

// Define Routes
const routes = [
    {
        path: '/',
        component: Login,
        name: 'Login',
    },
    {
        path: '/item',
        component: Item,
        name: 'Item',
        meta: { requiresAuth: true, roles: ['user'] }
    },
    {
        path: '/dashboard',
        component: Dashboard,
        name: 'Dashboard',
        meta: { requiresAuth: true, roles: ['user', 'admin'] }
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

// Global variable to control navigation
let allowNavigation = true;

// Function to allow navigation
export const allowRouteNavigation = () => {
    allowNavigation = true;
    router.push(router.currentRoute); // Trigger navigation
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

// Register Font Awesome Icon Component
app.component('font-awesome-icon', FontAwesomeIcon)

// Use Router
app.use(router)

// Mount App
app.mount('#app')