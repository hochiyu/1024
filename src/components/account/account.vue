<script setup lang="ts">
import { inject, reactive, watch } from 'vue'
import app from '@/components/settings/FirebaseConfig.vue'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth'
import { FirebaseError } from '@firebase/util'
import { doc, getDoc, getFirestore, increment, setDoc, updateDoc,arrayUnion } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

const login = inject('account', { name: '未登入', email: '', password: '' })
const state = inject('state', { 
  message: '請輸入帳號密碼', 
  status: 'info' as 'info' | 'error' | 'success' | 'warning' | undefined,
  action: 'signIn' as 'signUp' | 'signIn' | 'signOut'
})

const account = reactive({
  name: login.name,
  email: '',
  password: '',
})

watch(login, () => {
  if (login.email!== ""){
    account.email = login.email
    account.name = login.name
    state.action = 'signOut'
  }
})

async function handleClick(status: 'signIn' | 'signUp' | 'signOut') {
  try {
    state.status = 'info'
    if (status === 'signUp') {
      const storeName = account.name
      state.message = '註冊中...'
      const res = await createUserWithEmailAndPassword(auth, account.email, account.password)
      const uid = res.user.uid;
      await setDoc(doc(db, "user", uid), {
        name: storeName,
      });
      if (res.user) {
        state.status = 'success'
        state.message = '註冊成功'
      }
    } else if (status === 'signIn') {
      state.message = '登入中...'
      const res = await signInWithEmailAndPassword(auth, account.email, account.password)
      const uid = res.user.uid;
      const userDoc = await getDoc(doc(db, "user", uid));
      if (res.user) {
        if (userDoc.exists()) {
          account.name = userDoc.data().name? userDoc.data().name:''
        }
        state.action = 'signOut'
        state.status = 'success'
        state.message = account.email + '登入成功'
        await updateDoc(doc(db, "user", uid),{loginCount:increment(1)});
      }
    } else {
      state.message = '登出中...'
      await signOut(auth)
      state.action = 'signIn'
      state.status = 'success'
      account.name = '未登入'
      account.email = ''
      account.password = ''
      state.message = '登出成功'
    }
  } catch (e) {
    state.status = 'error'
    if (e instanceof FirebaseError) {
      switch (e.code) {
        case 'auth/email-already-in-use':
          state.message = '此帳號已被註冊'
          break
        case 'auth/invalid-email':
          state.message = '無效的帳號'
          break
        case 'auth/operation-not-allowed':
          state.message = '此帳號已被停用'
          break
        case 'auth/weak-password':
          state.message = '密碼強度不足'
          break
        case 'auth/user-disabled':
          state.message = '此帳號已被停用'
          break
        case 'auth/user-not-found':
          state.message = '此帳號不存在'
          break
        case 'auth/wrong-password':
          state.message = '密碼錯誤'
          break
        case 'auth/too-many-requests':
          state.message = '登入失敗次數過多，請稍後再試'
          break
        case 'auth/network-request-failed':
          state.message = '網路錯誤'
          break
        case 'auth/internal-error':
          state.message = '內部錯誤'
          break
        default:
          state.message = e.code
          break
      }
    } else {
      state.message = '系統錯誤'
    }
  }
}

</script>
<template>
  <v-container>
    <v-text-field v-if="state.action=='signUp'" v-model="account.name" label="姓名"></v-text-field>
    <div v-if="state.action=='signOut'">
    你好，{{ account.name }}
    </div>
    <v-text-field v-model="account.email" label="帳號"></v-text-field>
    <v-text-field v-model="account.password" label="密碼" type="password"></v-text-field>
    <v-alert :type="state.status" title="訊息" :text="state.message"></v-alert>

    <div class="mt-2" v-if="state.action==='signIn'">
      <v-btn color="primary" @click="handleClick('signIn')">登入</v-btn>
      <v-btn color="secondary" @click="()=>state.action = 'signUp'">我要註冊</v-btn>
    </div>
    <div class="mt-2" v-else-if="state.action==='signUp'">
      <v-btn color="primary" @click="handleClick('signUp')">註冊</v-btn>
      <v-btn color="secondary" @click="()=>state.action = 'signIn'">我要登入</v-btn>
    </div>
    <div  class="mt-2" v-else>
      <v-btn color="secondary" @click="handleClick('signOut')">登出</v-btn>
    </div>
  </v-container>
</template>