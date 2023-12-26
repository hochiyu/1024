<script setup lang="ts">
import { inject, reactive, watch } from 'vue';
import { doc, getFirestore, updateDoc ,deleteField,collection,query,where, orderBy,limit, getDocs} from 'firebase/firestore';
import app from '@/components/settings/FirebaseConfig.vue'
import { FirebaseError } from '@firebase/util';
const db = getFirestore(app);
const login = inject('account', { name: '未登入', email: '', id:'', loginCount: 0, subjects: []})
const account = reactive({
  name: login.name,
  loginCount: login.loginCount,
  subjects: login.subjects,
  record:[{unit:0,correctCount:0,incorrectCount:0}]
})
watch(login, () => {
  if (login.email!== ""){
    account.name = login.name,
    account.loginCount = login.loginCount,
    account.subjects = login.subjects
    console.log(login)
  } else {
    account.name = '未登入',
    account.loginCount = 0,
    account.subjects = []
  }
  },{ 
    immediate: true
  })
  const state = reactive({
  message: '',
})
async function handleClick(){
  if (login.id === '') {
    state.message = '尚未登入無法更新'
    return
  }
  try{
    state.message = '更新中...'
    const userRef = doc(db, "user", login.id);
    await updateDoc(userRef, {
      name: account.name
    });
    state.message = '更新成功'
  } catch(e){
    if (e instanceof FirebaseError) {
      state.message = e.message
    }else{
      state.message = '更新失敗'
    }
  }
}
async function deleteDoc(){
  const userRef = doc(db, "user", login.id);
    await updateDoc(userRef, {
      loginCount: deleteField()
    });
}




</script>
<template>
  <v-container>
    <v-text-field v-model=account.name label="姓名"></v-text-field>
    {{ state.message }}
    <v-btn color="primary" @click="handleClick">更新</v-btn>
    <v-btn color="secondary" >回首頁</v-btn>
    <v-btn color="secondary" @click="deleteDoc" >刪除</v-btn>       
    <v-card class="mx-auto mt-5" variant="outlined">
      <v-card-item>
        <v-card-title>
          學習進度
        </v-card-title>
        <v-card-subtitle>
          距離你上次登入......
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <div class="text-body-1 mb-2">
          已完成的科目：{{ account.subjects }}
        </div>
       
        
      </v-card-text>
      <v-card-actions>
        <v-btn>
          登入次數：{{ account.loginCount }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>