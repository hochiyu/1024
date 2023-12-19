<script setup lang="ts">
import { inject, reactive, watch } from 'vue';
</script>import { inject, reactive } from 'vue';
watch(login, () => {
  if (login.email!== ""){
    account.name = login.name
  }
  },{ 
    immediate: true

  })

const login = inject('account', { name: '未登入', email: '' })
const account = reactive({
  name: login.name,
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