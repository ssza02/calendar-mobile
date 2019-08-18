<template>

  <div class="calendar-box" :style='{height:calHeight + "px"}'>
    <ul class="calendar-head">
      <li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li><li>日</li>
    </ul>
    <transition name="fade">
    <calendarContent ref="calendar_swiper" :checkDate="current_day" @on-change="changeIndex" @calendarHeight="calendarHeight">
      <div v-for="(month,index) in monthList" :key="index" class="month swiper-item">
        <ul v-for="(week,weekindex) in month" :key="weekindex">
          <li v-for="(day,dayindex) in week" :class="{ischecked:checkedDay==day.date,istoday:day.istoday}"  @click.prevent.stop="chooseDay(day.year,day.month,day.day,day.othermonth,day.mode)">
            <div class="week-day" :class="{ischecked:checkedDay==day.date,othermonth:day.othermonth,istoday:day.istoday}">
              <span class="one-day">
                <i v-if="day.istoday" class="day today">今</i>
  				    	<i v-else class="day">{{day.day}}</i>
  				    	<!-- <i>{{day.nongli.old_str}}</i> -->
              </span>
              <div class="thing">
                <a v-if="thing.title" :style="{color:thing.color}" v-for="thing in day.thing"></a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </calendarContent>
    </transition>
      <div class="calendar-today">{{formateTime}}</div>
      <div class="calendar-toggle">
        <div class="toggle-line"></div>
      </div>

  </div>
</template>
<script>
  import calendarContent from '../test_canlen/swiper-monthorweek.vue'
  import format from '../test_canlen/format'
  export default{
    data(){
      return{
        disp_date:new Date(),
        today:new Date(),
        current_day:new Date(),
        monthList:[],
        checkedDay:'0000-00-00',
        can_click:true,
        calHeight:''  //日历外框高度，自适应要用到
      }
    },
    components:{
      calendarContent
    },
    computed:{
      //当前选中日期
      formateTime(){
        // 标准时间转xxxx年xx月xx日
        return this.formatDateTime(this.disp_date);
      }
    },
    created(){
      this.todayDate();
      this.get3month()
    },
    methods:{
      calendarHeight(newVal){
        this.calHeight = newVal + 30;
        console.log('---val---'+newVal);
      },
      todayDate(){
        this.checkedDay = this.formatDateTime(this.today);
      },
      chooseDay(year,month,day,othermonth,mode){
        // 为了PC端点击事件和移动冲突
        if(!this.can_click)return
        this.current_day = new Date(year,month,day)
        this.checkedDay = this.format(year,month,day)
        if(othermonth && mode == 'month'){
          var _tmpdt = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth()-othermonth,0)
          var maxday = _tmpdt.getDate()
          var _day = maxday<day?maxday:day
          this.disp_date = new Date(year,month-othermonth,_day)
          this.changeIndex(othermonth,false,true)
        }else if(othermonth && mode == 'week'){
          this.disp_date = this.current_day
        }else{
          this.disp_date = this.current_day
        }
      },
      formatDateTime(date){
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        return y + '-' + m + '-' + d;
      },
      format(year,month,day){
        month++
        month<10&&(month='0'+month)
        day<10&&(day='0'+day)
        return year + '-' + month + '-' + day;
      },
      getWeek(year,month,day){
        //year,month,day为选中当天的年月日
        var dt = new Date(year,month,day)
        var weekArr = []
        var dt_first = new Date(year,month,day-((dt.getDay()+6) % 7))
        var week = []
        //循环选中当天所在那一周的每一天
        for(var j=0;j<7;j++){
          var newdt = new Date(dt_first.getFullYear(),dt_first.getMonth(),dt_first.getDate()+j)
          var _year = newdt.getFullYear()
          var _month = newdt.getMonth()
          var _day = newdt.getDate()
          week.push({
            mode:'week',
            day:_day,
            year:_year,
            month:_month,
            date:this.format(_year,_month,_day),
            //日历要显示的其他内容
            // thing:(day == 22 || day == 4) ? [{title:'预约',color:'red'}]:[],
            thing:this.ifOrder(_year,_month,_day),
            nongli:format.solar2lunar(_year,_month+1,_day),
            istoday:(this.today.getFullYear()==_year && this.today.getMonth()==_month && this.today.getDate() == _day)?true:false,
            ischecked:false,
            othermonth:_month!=month
          })
        }
        // console.log('---week---'+ JSON.stringify(week,null,2))
        weekArr.push(week)
        return weekArr
      },
      getMonth(year,month){  //创建单月历
        var monthArr = []
        var dt_first = new Date(year,month,1)   //每个月第一天
        var dt_last = new Date(year,month+1,0)   //每个月最后一天
        var monthLength = dt_last.getDate()-dt_first.getDate()+1
        var daylist =[];
        var space = (dt_first.getDay() - 1 + 7) % 7   //月历前面空格
        // console.log(year,month)
        for(var i = -space;i<36;i+=7){
          var week = []
          for(var j=0;j<7;j++){
            var day = i+j+1
            // console.log('day:'+day);
            if(day>0 && day<=monthLength){
              week.push({
                mode:'month',
                day:day,
                year:year,
                month:month,
                date:this.format(year,month,day),
                //日历要显示的其他内容
                thing:this.ifOrder(year,month,day),
                nongli:format.solar2lunar(year,month+1,day),
                istoday:(this.today.getFullYear()==year && this.today.getMonth()==month && this.today.getDate() == day)?true:false,
                ischecked:false
              })
            }else{
              //其它月份
              //week.push({})
              var newdt = new Date(year,month,day)
              var _year = newdt.getFullYear()
              var _month = newdt.getMonth()
              var _day = newdt.getDate()
              week.push({
                mode:'month',
                day:_day,
                year:_year,
                month:_month,
                date:this.format(year,month,day),
                thing:this.ifOrder(year,month,day),
                nongli:format.solar2lunar(_year,_month+1,_day),
                istoday:(this.today.getFullYear()==_year && this.today.getMonth()==_month && this.today.getDate() == _day)?true:false,
                ischecked:false,
                othermonth:day<=0?-1:1,
              })
            }
          }
          monthArr.push(week)
        }
        return monthArr
      },
      ifOrder(year,month,day){
        let dateTime = this.format(year,month,day);
        // console.log(dateTime)
        if(dateTime === '2019-07-06' || dateTime === '2019-07-07'|| dateTime === '2019-07-29'){
          // alert('预约');
          return [{title:'.'}]
        }else{
          return []
        }
        
      },
      get3month(){
        console.log('get3month');
        var year = this.disp_date.getFullYear()
        var month = this.disp_date.getMonth()
        this.monthList = []
        this.monthList.push(this.getMonth(year,month-1))
        this.monthList.push(this.getMonth(year,month))
        this.monthList.push(this.getMonth(year,month+1))
      },
      get3week(){
        console.log('get3week');
        var year = this.disp_date.getFullYear()
        var month = this.disp_date.getMonth()
        var day = this.disp_date.getDate()
        this.monthList = []
        this.monthList.push(this.getWeek(year,month,day-7))
        this.monthList.push(this.getWeek(year,month,day))
        this.monthList.push(this.getWeek(year,month,day+7))
        console.log(this.monthList)
      },
      changeIndex(index,is_week,is_click = false){
        // console.log(index,is_week);
        if(index){
          if(is_week){
            this.disp_date = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth(),this.disp_date.getDate()+(7*(index)))
            this.checkedDay = this.format(this.disp_date.getFullYear(), this.disp_date.getMonth(), this.disp_date.getDate())
            this.current_day = this.disp_date
            this.get3week()
          }else{
          //console.log(this.disp_date.getMonth()+index)
            var _tmpdt = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth()+index,0)
            var maxday = _tmpdt.getDate()
            var _day = maxday<this.disp_date.getDate()?maxday:this.disp_date.getDate()
            console.log(_day)

            this.disp_date = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth()+index,_day)
            if(!is_click){
              this.checkedDay = this.format(this.disp_date.getFullYear(),this.disp_date.getMonth(),this.disp_date.getDate())
              console.log(this.checkedDay)
            }
//            console.log(this.format(this.disp_date.getFullYear(),this.disp_date.getMonth(),_day))
            this.get3month()

            console.log('move_change')
          }
          this.$refs.calendar_swiper.move_change()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
@import "../../assets/css/m_base.less";
  .calendar-box{
    position: relative;
    color: #fff;
    background: #fff;
    // height:100%;
    z-index:99;
    transition: all .2s ease;
    overflow: hidden;
  }
  .calendar-head{
    /* background: #4188d8; */
    display: flex;
    height:30px;
    line-height: 30px;
  }
  .calendar-head li{
    flex-grow: 1;
    text-align: center;
    color: #333;
    font-size: 0.1rem;
  }
  .calendar-today{
    position: absolute;
    width: 100%;
    height: 0.2rem;
    text-align: center;
    font-size: 15px;
    color: #333;
    z-index: 9;
    bottom:0.2rem;
    background: #fff;
  }
  .calendar-toggle{
    position: absolute;
    width: 100%;
    height: 0.1rem;
    z-index: 9;
    bottom:0.1rem;
    background: #fff;
    .toggle-line{
      position: absolute;
      left: 50%;
      bottom: 0.04rem;
      transform: translateX(-50%);
      width: 0.3rem;
      height: 0.02rem;  
      background: #D6D6D6;
      border-radius: 1px;
    }
  }
  .swiper-item{
    position: absolute;
    width:100%;
    height:100%;
    top:0;
  }
  .swiper-item:nth-child(1){
    left: -100%;
  }
  .swiper-item:nth-child(2){
    left:0;
  }
  .swiper-item:nth-child(3){
    left: 100%;
  }
  .month ul{
    display:flex;
    margin:0;
    padding:0;
    width: 100%;
    height:40px;
    min-height:40px;
    border-right:1px solid #eee;
  }
  .month li{
    flex: 1;
    flex-grow: 1;
    color: #333;
    overflow: hidden;
  }
  .week-day{
    position: relative;
    width: 38px;
    height: 38px;
    margin: auto;
    font-size:12px;
    text-align: center;
    border: 0;
    line-height: 10px;
    overflow: hidden;
    border-top: 1px solid #fff;
    /* border-left: 1px solid #fff; */
    z-index: 1;
    /* height:140px; */
  }
  .week-day .one-day{
    
  }
  .week-day i{
    display:block;
    text-align: center;
    font-size: 10px;
    font-style:normal;
    padding:1px;
    line-height: 38px;
    height:38px;
  }
  .week-day.ischecked{
    border-radius: 50px;
    color: #fff !important;
    background-image: linear-gradient(-128deg, #936BFA 0%, #4B52F4 90%);
    .thing a{
      color: #fff;
      background: #fff;
    }
    // transition: all .2s ease-in ;
  }
  .week-day.ischecked.istoday{
    .today{
      color: #fff;
    }
  }
  .thing{
    position: absolute;
    left: 50%;
    bottom: 0.02rem;
    transform: translateX(-50%);
    margin-top: 3px;
  }
  .thing a {
    cursor: pointer;
    display: block;
    width: 4px;
    height: 4px;
    word-break: break-all;
    line-height: 4px;
    color: #5054F4;
    background: #5054F4;
    border-radius: 50%;
  }

  .othermonth{
    color: #dcafaf;
  }
  .istoday{
    .today{
      font-size: 16px;
      color: #5054F4;
    }
  }
  /* .ischecked{
    background-color: #f17117!important;
  } */
</style>
