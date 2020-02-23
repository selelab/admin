const Vmodel  = {
  data() {
    return {
      isClicked: false,
      studentNumber: '',
      studentName: '',
      date: '',
      day: '',
      time: '',
      place: '',
      numberOfPeople: '',
      purpose: '',
      check:false,
      
    }
  },
  template:`<div>
    <h1>教室申請</h1>
    <div class="form-wrapper">
      <div class="form-item">
        学籍番号：<input type="text" v-model="studentNumber">
        
      </div>
      <div class="form-item">
        氏名：<input type="text" v-model="studentName">
        
      </div>
      <div class="form-item">
        日付：<input type="date" v-model="date">
        
      </div>
      <div class="form-item">
        曜日：<input type="week" v-model="day">
        
      </div>
      <div class="form-item">
        時間：<input type="time" list ="one" v-model="time">-<input type ="text" v-model ="time">
        <datalist id = "one">
        <option value ="15:00"></option>
        <option value ="16:00"></option>
        <option value ="17:00"></option>
      </div>
      <div class="form-item">
        場所：<input type="text" v-model="place">
        
      </div>
      <div class="form-item">
        人数：<input type="text" v-model="numberOfPeople">
        
      </div>
      <div class="form-item">
        目的：<input type="text" v-model="purpose">
        
      </div>
      <button @click="certifyClick()">確認</button><br>
    </div>
  </div>`,
  methods:{
    certifyClick: function(){
      console.log('qqqqq')
      const infomationTable = {
        studentNumber: this.studentNumber,
        studentName: this.studentName,
        date: this.date,
        day: this.day,
        time: this.time,
        place: this.place,
        numberOfPeople: this.numberOfPeople,
        purpose: this.purpose
      }
      this.$router.push({ name: 'check', params: { infomationTable: infomationTable }})
    }
    
  } 
}
export { Vmodel }
