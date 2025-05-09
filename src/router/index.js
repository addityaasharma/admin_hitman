import Login from '@/components/Login.vue';
import Banner from '@/views/Banner.vue';
import Dashboard from '@/views/dashboard.vue';
import Post from '@/views/Post.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path : '/login',
    name : 'Login',
    component : Login
  },
  {
    path : '/',
    name : "Dashboard",
    component : Dashboard,
    children : [
      {
        path : 'posts',
        name : "Posts",
        component : Post
      },
      {
        path : 'banner',
        name : "Banner",
        component : Banner
      }
    ]
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;