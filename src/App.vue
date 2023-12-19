<script setup lang="ts">
import { provide, reactive, readonly, ref } from 'vue'
import app from '@/components/settings/FirebaseConfig.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import router from './router'
import {doc,getDoc ,getFirestore} from "firebase/firestore"

let drawer = ref(false)
let items = [
  { title: '個人資料', to: '/profile' },
  { title: '英文', to: '/english' },
  { title: '地理', to: '/geography' },
  { title: '地理講義', to: '/geographyhandouts' },
  { title: '歷史', to: '/history' },
  { title: '國文', to: '/chinese' }
]

const account = reactive({
  name: '未登入',
  email: '',
  id: '',
  password: '',
  loginCount: 0
})

const state = reactive({
  message: '請輸入帳號密碼',
  status: 'info' as 'info' | 'error' | 'success' | 'warning' | undefined,
  action: 'signIn' as 'signUp' | 'signIn' | 'signOut'
})

provide(/* key */ 'account', /* value */ readonly(account))
provide(/* key */ 'state', /* value */ state)

const db =getFirestore(app);
const auth = getAuth(app)
const unsub = onAuthStateChanged(auth, async (user)=>{
  if (user) {
    account.name='已登入'
    account.email = user.email?user.email:''
    account.id = user.uid
    
    const userDoc = await getDoc(doc(db, "user", user.uid));

    if (userDoc.exists()) {
      account.name = userDoc.data().name? userDoc.data().name:''
      account.loginCount = userDoc.data().loginCount
    }
    else{
      account.name = '未登入'
    }
  }
  else{
    account.name='未登入'
    account.email = ''
  }
  return () => {
    unsub();
  }}
);

function goAccount() {
  router.push('/account')
}

</script>

<template>
  <v-app class="rounded rounded-md">
    <v-app-bar>
      <v-icon icon="plus"></v-icon>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">menu</v-app-bar-nav-icon>
      <v-app-bar-title>Application bar</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" v-if="account.email===''" @click="goAccount">請先登入</v-btn>
      <v-btn variant="outlined" v-else @click="goAccount">我要登出</v-btn>
    </v-app-bar>
    <v-navigation-drawer floating permanent v-model="drawer">
      <v-list>
        <v-list-item v-for="item in items" :title="item.title" :key="item.title" :to="item.to">
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex flex-column align-start justify-start mb-6" style="min-height: 300px">
      <Suspense>
        <RouterView />
      </Suspense>
    </v-main>
  </v-app>
</template>