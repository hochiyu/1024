<script setup lang="ts">
import { inject, reactive, watch } from 'vue';



const login = inject('account', { name: '未登入', email: '' })
const account = reactive({
  name: login.name,
})
watch(login, () => {
  if (login.email!== ""){
    account.name = login.name
  }
  },{ 
    immediate: true

  })
</script>
<template>
  <v-container>
    <v-text-field v-model=account.name label="姓名"></v-text-field>
    <v-btn color="primary" >更新</v-btn>
    <v-btn color="secondary" >回首頁</v-btn>    
  </v-container>
</template>
</script>
<template>
  <v-container>
    <v-text-field label="姓名"></v-text-field>
    <v-btn color="primary" >更新</v-btn>
    <v-btn color="secondary" >回首頁</v-btn>    
  </v-container>
</template>