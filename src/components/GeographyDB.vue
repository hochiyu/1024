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
  <v-container>
    {{ account.name }}
    <v-select label="請選擇" v-model="state.choice" :items="units"> </v-select>
    
    <div v-for="(exam, index) in state.exams" :key="index">
      <v-text-field
        v-if="exam.type == 'blank'"
        v-model="state.answer[index]"
        :label="exam.question"
        :messages="state.message[index]"
      ></v-text-field>
    

      <p v-if="exam.type === 'radio'">
        <!-- {{ exam.question }}
        <span v-for="option in exam.option" :key="option">
          <input type="radio" v-model="state.answer[index]" :label="option" :value="option" />
          {{ option }}
        </span>
        {{ state.message[index] }} -->
        <v-radio-group
          :label="exam.question"
          :messages="state.message[index]"
          v-model="state.answer[index]"
        >
          <span v-for="option in exam.options" :key="option">
            <v-radio :label="option" :value="option"></v-radio>
          </span>
        </v-radio-group>
      </p>

      <div v-if="exam.type === 'checkbox'">
      <p>{{ exam.question }}</p>
      <span v-for="options in exam.options" :key="options">
        <v-checkbox inline v-model="state.answers[index]" :label="options" :value="options" ></v-checkbox>
      </span>
        {{ state.message[index] }}
        <v-alert color="info" icon="$info" title="檢查結果">
      共答對{{ state.correctCount }}題 / 答錯{{ state.incorrectCount  }}題
    </v-alert>
    </div>
    </div>

    <v-btn color="primary" @click="checkAnswers">檢查答案</v-btn>
    <v-btn color="secondary" @click="$router.push('/geographyhandouts')" >重新複習</v-btn>

  </v-container>

</template>