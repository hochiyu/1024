<script setup lang="ts">
import { reactive, watch, inject } from 'vue'
import { addDoc, collection, getDocs, getFirestore, where, query } from 'firebase/firestore'
import app from '@/components/settings/FirebaseConfig.vue'

let units = [
  { title: '單元一 東半球的地理', value: 1 },
  { title: '單元二 西半球的地理', value: 2 }
]
//點選select時，會改變state.choice，利用watch，當state.choice改變時，重新讀取題目
const state = reactive({
  choice: { title: '單元一 東半球的地理', value: 1 },
  answer: [''],
  answers: [[], []],
  message: [''],
  correct:0,
  correctCount :0,
  incorrectCount :0,
  m:"",
  exams: [{ question: '', answer: '', answers: [''], options: [''], type: '' }]
})

watch(() => state.choice, generateQuestions)
async function generateQuestions() {
  console.log(state.choice)
  state.exams = []
  const queryExam = query(examCollection, where('unit', '==', state.choice))
  const querySnapshot = await getDocs(queryExam)
  querySnapshot.forEach((doc) => {
    state.answers.push([]);
    state.exams.push({
      question: doc.data().question,
      answer: doc.data().answer,
      answers: doc.data().answers,
      options: doc.data().options,
      type: doc.data().type
    })
  })
  console.log(state.exams)
}
const account = inject('account', { name: '未登入', email: '', id: '' })
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)
const examCollection = collection(db, 'Geography')
generateQuestions()
// watch(() => state.choice, generateQuestions)

async function checkAnswers() {
  state.message = [] // clear previous messages
  state.correctCount = 0
  state.incorrectCount = 0
  for (let i in state.exams) {
    if (state.exams[i].type === 'blank' || state.exams[i].type === 'radio') {
      if (state.answer[i] !== state.exams[i].answer) {
        state.message[i] = '答案錯誤'
        state.incorrectCount++
      } else {
        state.message[i] = '答案正確'
        state.correctCount++
      }
    }
    if (state.exams[i].type === 'checkbox') {
      if (state.exams[i].answers.length === state.answers[i].length) {
        let correct = 0
        for (var item of state.answers[i]) {
          if (state.exams[i].answers.includes(item)) {
            correct++
          }
        }
        if (correct == state.exams[i].answers.length) {
          state.message[i] = '答案正確'
          state.correctCount++
        } else {
          state.message[i] = '答案錯誤'
          state.incorrectCount++
        }
      } else {
        state.message[i] = '答案錯誤'
        state.incorrectCount++
      }
    }
  }


  await addDoc(collection(db,"user/"+account.id+"/record"),
    {
      subject: "地理",
      unit: state.choice,
      correctCount: state.correctCount,
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
    src="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAF0xqRxlnc&#x2F;view?embed"  allow="fullscreen">
  </iframe>
</div>
范莛莙 設計的 <a href="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAF0xqRxlnc&#x2F;view?utm_content=DAF0xqRxlnc&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" rel="noopener">Geography</a>
<v-btn color="secondary" @click="$router.push('/geography')" >前往測驗</v-btn>
</template>
