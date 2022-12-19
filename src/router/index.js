import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "MainView",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "LoginView",
    component: () => import("@/views/LoginView.vue"),
    redirect: "",
    children: [
      {
        path: "",
        name: "UserLogin",
        component: () => import("@/components/user/UserLogin.vue"),
      },
      {
        path: "role",
        name: "UserRole",
        component: () => import("@/components/user/UserRole.vue"),
      },
    ]
  },
  {
    path: "/signup",
    name: "SignUpForm",
    component: () => import("@/components/user/SignUpForm.vue")
  },
  {
    path: '/signupteacher',
    name: 'SignUpBasicTeacher',
    component: () => import('@/components/user/SignUpBasicTeacher.vue')
  },
  {
    path: '/signupassistant',
    name: 'SignUpBasicAssistant',
    component: () => import('@/components/user/SignUpBasicAssistant.vue')
  },
  {
    path: '/signupstudent',
    name: 'SignUpBasicStudent',
    component: () => import('@/components/user/SignUpBasicStudent.vue')
  },
  // {
  //   path: "/course",
  //   name: "course",
  //   redirect: "courseList",
  //   children: [
  //     {
  //       path: "/list",
  //       name: "courseList",
  //       component: () => import("@/components/course/CourseList.vue")     // 만약 component이름 바뀌면 변경
  //     },
  //     {
  //       path: "/add",
  //       name: "addCourse",
  //       component: () => import("@/components/course/AddCourse.vue")
  //     },  // 이후 추가할 강좌관련 컴포넌트는 여기에 추가
  //   ]
  // }
  {
    path: '/assignment',
    name: 'AssignmentManage',
    component: () => import('@/components/attendance/AssignmentManage.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router