<script setup lang="ts">
import { inject, reactive, watch } from 'vue'
import { collection, getDocs, getFirestore, where, query, arrayUnion,addDoc } from 'firebase/firestore'
import app from '@/components/settings/FirebaseConfig.vue'
import { doc, updateDoc } from 'firebase/firestore';
let units = [
  { title: '單元一 台灣歷史', value: 1 },
  { title: '單元二 中國歷史', value: 2 }
]
const state = reactive({
  choice: { title: '單元一 台灣歷史', value: 1 },
  answer: [],
  answers: [[]],
  correct:0,
  message: [''],
  incorrectCount:0,
  exams: [{ question: '', option: [], answer: '', type: '' }]
})
const appAccount = inject('account', { name: '未登入', email: '', password: '',id:"" })
async function generateQuestions() {
  console.log(state.choice)
  state.exams = []
  state.answers = []
  state.answer = []
  const queryExam = query(examCollection, where('unit', '==', state.choice))
  const querySnapshot = await getDocs(queryExam)
  querySnapshot.forEach((doc) => {
    state.answers.push([])
    state.exams.push({
      question: doc.data().question,
      option: doc.data().option,
      answer: doc.data().answer,
      type: doc.data().type
    })
  })
}
const db = getFirestore(app)
const examCollection = collection(db, 'History')
generateQuestions()
watch(() => state.choice, generateQuestions)
 async function checkAnswers() {
 state.message = [] // clear previous messages
 state.correct =0
 state.incorrectCount=0
 
 for (let i in state.exams) {
  if (state.exams[i].type == 'random') {
    if (state.answer[i] !== state.exams[i].answer) {
      state.message[i] = '不正確'
      state.incorrectCount++
    } else {
      state.message[i] = '正確'
      state.correct++
    }
  } else {
    if (state.exams[i].answer.length === state.answers[i].length) {
      let correct = 0
      for (var item of state.answers[i]) {
        if (state.exams[i].answer.includes(item)) {
          correct++
        }
      }
      // console.log(correct)
      if (correct == state.exams[i].answer.length) {
        state.message[i] = '答案正確'
        state.correct++
      } else {
        state.message[i] = '答案錯誤'
        state.incorrectCount++
      }
    } else {
      state.message[i] = '答案錯誤'
      state.incorrectCount++
      console.log("error")
    }
  }
}
await updateDoc(doc(db,"user",appAccount.id),{subjects:arrayUnion("History")})
await updateDoc(doc(db,"user",appAccount.id),{subjects:arrayUnion("History"+state.choice)})
await addDoc(collection(db,"user/"+appAccount.id+"/record"),
    {
      subject: "History",
      unit: state.choice,
      correctCount: state.correct,
      incorrectCount: state.incorrectCount,
      date: new Date()
    }
  );
}
</script>
<template>





<div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%;
 padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
 border-radius: 8px; will-change: transform;">
  <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
    src="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAF2Frbx7tE&#x2F;view?embed" allow="fullscreen">
  </iframe>
</div>
蘇友祥 設計的 <a href="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAF2Frbx7tE&#x2F;view?utm_content=DAF2Frbx7tE&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" rel="noopener">White Illustrative Creative Literature Project Presentation</a>
  <v-container>
    <v-select label="請選擇" v-model="state.choice" :items="units"> </v-select>
    <div v-for="(exam, index) in state.exams" :key="index">
      {{ state.exams[index].question }}
      <div v-if="state.exams[index].type == 'random'">
        <v-text-field
          v-model="state.answer[index]"
          :label="exam.question"
          :messages="state.message[index]"
        ></v-text-field>
      </div>
      <div v-else>
        <span v-for="option in exam.option" :key="option">
          <input type="checkbox" v-model="state.answers[index]" :value="option" />
          {{ option }}
        </span>
        {{ state.message[index] }}
      </div>
    </div>
    共答對{{ state.correct }}題 / 答錯{{ state.incorrectCount  }}題
    <v-btn color="primary" @click="checkAnswers">檢查答案</v-btn>
  </v-container>
</template>


