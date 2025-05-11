import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import Banner from '@/views/Banner.vue';
import Post from '@/views/Post.vue';
import Dashboard from '@/views/Dashboard.vue';
import WelcomePage from '@/views/WelcomePage.vue';
import Frontpage from '@/views/frontpage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomePage,
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: '', // Default route within dashboard
        name: 'Hello',
        component: Frontpage,
      },
      {
        path: '/posts',
        name: 'Posts',
        component: Post,
      },
      {
        path: '/banner',
        name: 'Banner',
        component: Banner,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); 
  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Welcome' }); // Redirect to Welcome page if already logged in
  } else {
    next();
  }
});

export default router;
