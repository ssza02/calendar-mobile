<template>
<transition name="fade">
  <div class="calendarBox" ref="calendar" :class='[{transition:transition}]' :style="{height: calendarHeight == -100 ? '282px':calendarHeight + 'px' }"
       @touchstart.stop="moveStart"
       @touchend.stop="moveEnd"
       @touchmove.prevent="move"
       @click.prevent="toggleMove()"
       style="overflow:hidden;">
    <div style="height: 100%;white-space: nowrap" :class="{transition:transition}" :style="{transform: 'translate3d('+calendarMove.x+'px,'+calendarMove.y+'px,0px)'}" >
      <slot></slot>
      <!-- <slot name="dateTime"></slot>
      <slot name="calendarToggle"></slot> -->
    </div>
  </div>
</transition>
</template>
<script>
  export default{
    data(){
      return{
        transition:true,//是否显示动画
        calendarHeight:-100, //日历的高度
        calendarMove:{
          x:0,
          y:0
        },
        move_start_x:0, //开始移动的位置x轴
        move_start_y:0, //开始移动的位置y轴
        move_mode:1,  //移动方式,1左右移动,2上下移动
        can_change_mode:true, //是否可以改变移动方式
        move_start_calendarHeight:0,  //开始移动的高度初始值
        can_move:false, //是否触发move事件
        itemWidth:0,  //窗口的宽度
        move_index:0, // 左右移动 1 向右移动-1向左移动
        line_num:0, //  选中或今天是第几行的周
        is_week:false, //是否是周历模式

      }
    },
    props:['checkDate'],
    created(){
//      初始化日历宽度和line_num
      this.itemWidth = window.innerWidth
      this.line_num = this.calc_line_num(this.checkDate)
    },
    watch:{
      checkDate(val){
        if(val){
          this.line_num = this.calc_line_num(val)
          console.log(this.line_num,'行')
        }
      },
      calendarHeight(newVal){
        console.log('---newVal---'+newVal);
        this.$emit('calendarHeight',newVal);
      }
    },
    methods:{
//      PC端为了鼠标移出日历后不能触发mouseup事件而触发的事件
      moveEnd_pc_1(e){
        if(this.can_move){
          this.moveEnd_pc(e)
        }
      },
//      pc端开始移动
      moveStart_pc(e){
        if(!ISPC)return
        this.moveStart(e)
      },
      //      pc端移动
      move_pc(e){
        if(!ISPC)return
        this.move(e)
      },
      //      pc端结束移动
      moveEnd_pc(e){
        if(!ISPC)return
        this.moveEnd(e)
      },
      //      手机端端开始移动
      moveStart(e){
        // alert('666')
        var touch;
        if(e.changedTouches){
          touch = e.changedTouches[0];
        }else{
          touch = e
        }
        this.move_start_x = touch.clientX
        this.move_start_y = touch.clientY
        this.move_start_calendarHeight = this.calendarHeight
        this.can_move = true
        this.move_mode = 0
        this.$parent.can_click = true
        
        console.log("move_start_y---"+this.move_start_y)
      },
      toggleMove(e){

        console.log("点击");
        console.log("this.calendarHeight---"+this.calendarHeight)
        if(this.calendarHeight == 80){

          this.calendarHeight = 282;

          this.move_init(true)
          setTimeout(()=>{
          this.$parent.get3month()
          },500)
          
        }else{

          this.calendarHeight = 80;

          this.move_init(false)
        }
        
      },
      //      手机端端移动
      move(e){
        if(!this.can_move)return
        var touch;
        if(e.changedTouches){
          touch = e.changedTouches[0];
        }else{
          touch = e
        }
        this.$parent.can_click = false
        if(this.can_change_mode){
          if(Math.abs(touch.clientX - this.move_start_x) > Math.abs(touch.clientY - this.move_start_y)){
            this.move_mode = 1
          }else{
            this.move_mode = 2
          }
          this.can_change_mode = false
        }
        console.log(this.move_mode)
//        左右移动
        if(this.move_mode == 1){
          this.calendarMove.x = touch.clientX - this.move_start_x
        }
//        上下移动
        if(this.move_mode == 2){
          console.log("touch.clientY---"+touch.clientY)
          if(this.calendarHeight == 80){
            console.log("this.calendarHeight-----------"+this.calendarHeight);
            this.$parent.get3month()
          }
          
          let move_width = '';
          // if(0<Math.abs(touch.clientY - this.move_start_y<240)){
          //   move_width = Math.abs(touch.clientY - this.move_start_y);
          // }
          // touch.clientY 日历动态高度
          // this.move_start_y 点击位置高度坐标
          move_width = Math.abs(touch.clientY - this.move_start_y);
          console.log("move_width---"+move_width);
          if(touch.clientY > this.move_start_y && this.move_start_y< 200){
            console.log("down");
            if(touch.clientY > 298){
              return
            }
            this.calendarHeight = this.move_start_calendarHeight + move_width                                                                                
            this.calendarMove.y = -((this.line_num*40 > move_width)?this.line_num*40 - move_width:0)
            // this.calendarMove.y = move_width
          }else if(touch.clientY < this.move_start_y && this.move_start_y> 200){
            console.log("up");
            if(touch.clientY < 100){
              return
            }
            this.calendarHeight = this.move_start_calendarHeight - move_width
            // this.calendarMove.y = -((move_width<=this.line_num*40)?move_width:this.line_num*40)
            this.calendarMove.y = -move_width
            console.log(" this.calendarMove.y---"+ this.calendarMove.y)
          }
        }
      },
      //      手机端端结束移动
      moveEnd(e){
        this.can_move = false
        if(this.move_mode == 0)return
        var touch;
        if(e.changedTouches){
          touch = e.changedTouches[0];
        }else{
          touch = e
        }

        this.can_change_mode = true
        if(this.move_mode == 1){
          if(this.move_start_x < touch.clientX){
            if(this.move_start_x - touch.clientX < -50){
              this.calendarMove.x = this.itemWidth
              this.move_index = -1
            }else{
              this.calendarMove.x = 0
            }
          }else{
//            console.log(this.move_start_x - touch.clientX)
            if(this.move_start_x - touch.clientX > 50){
              this.calendarMove.x = -this.itemWidth
              this.move_index = 1
            }else{
              this.calendarMove.x = 0
            }
          }
        }
        if(this.move_mode == 2){
          if(this.move_start_y - touch.clientY < 0){
            if(this.move_start_y - touch.clientY < -50){
              this.move_init(true)
              this.$parent.get3month()
            }else{
              this.move_init(false)
              // this.$parent.get3month()
            }
          }else{
            if(this.move_start_y - touch.clientY > 50){
              this.move_init(false)
              // this.$parent.get3month()
            }else{
              this.move_init(true)
              this.$parent.get3month()
            }
          }
        }
        this.transition = true
        setTimeout(()=> {
          this.transition = false
          if(this.move_mode == 1){
            this.$emit('on-change',this.move_index,this.is_week)
          }
        },500)

      },
      move_change(_index){
        this.transition = false
        this.calendarMove.x = 0
      },
      move_init(mode){
        this.is_week = !mode
        if(mode){
          var self = this
          self.calendarHeight = -100
          this.calendarMove.y = 0
//          console.log(self.calendarHeight)
          //日历高度设置为最大高度
          setTimeout(function(){
            self.calendarHeight = self.$refs.calendar.offsetHeight
          },300);
        }else{
//          恢复高度
          this.calendarHeight = 80
          this.calendarMove.y = -(80*this.line_num)
          setTimeout(()=>{
            this.$parent.get3week();
          },150)
          this.calendarMove.y = 0
        }
      },
      calc_line_num(day){
        //计算今天在第几行
        var year = day.getFullYear()
        var month = day.getMonth()
        var dt_first = new Date(year,month,1)   //每个月第一天
        var space = (dt_first.getDay() - 1 + 7) % 7   //月历前面空格
        //console.log(space + day.getDate())
        return parseInt((space + day.getDate() - 1) / 7)
      }
    }
  }
</script>
<style scoped>
  .calendarBox{
    position: relative;
    height: 282px;
    z-index: 99;
    /* animation:calendarHeight .2s infinite; */
  }

  /* @keyframes calendarHeight
  {
  from {height:80px;}
  to {height:280px;}
  } */

  .transition{
    transition: all .2s linear;
  }
</style>
