<template>
  <div class="home">
    <!-- <header>
        <div class="top_toast"></div>
        <div class="top_title_box">
          <span class="icon-return back-btn top-back-icon top_back"></span><h1 class="top_title">来客预约</h1>
          <a href="register.html" class="top_register_btn">注册</a>
        </div>
    </header> -->
    <body>
        <div class="main">
            <div class="calendar-wrap" :class='fullToggle?"full-calendar":""'>
                <canlen></canlen>

            </div>
            <div class="order-record-wrap">
                <div v-if="appointment" class="record gray">
                    <div class="record-history">
                        <div class="record-list">
                            <ul>
                                <li>

                                </li>
                            </ul>
                        </div>
                    </div>
               
                </div>
                
            </div>
        </div>
        
        <!-- <mt-button type="danger" size="small">退出登录</mt-button> -->
    </body>
    <footer></footer>
  </div>
</template>

<script>


  //import logo from 'assets/img/logo.png'
  //import modal from 'components/modal.vue'

  import canlen from '../components/test_canlen/calendar'

  export default {
    components: {
      canlen
    },
    mounted() {

    },
    data () {
      return {
        // logoImg: logo,
        fullToggle:false,
        appointment:true
      }
    },
    created () {
  

    },
    methods: {
        linkToRecord(){
            this.$router.push("/addRecord");
        },

    }
  }
</script>

<style lang="less">
@import "../assets/css/m_base.less";
  .home{
      width:3.75rem;
      height:0.44rem;
  }
  .main{
      height: 100vh;
      background: #efefef;
  }
  .calendar-wrap{
      position: absolute;
      left: 0;
      top:0;
      width: 100%;
      height: 1.1rem;
      
      &.full-calendar{
        //   height: 2.62rem;
      }

  }
  .order-record-wrap{
    position: absolute;
    left: 0;
    top:1.1rem;
    height: calc(100% - 1.1rem);
    width: 100%;
    overflow:auto;
    .record{
      position: relative;
      width: 100%;
      background-size: cover; 
      &.gray{
         background: #F7F7F9;
      }
      .record-history{
         .record-list{
             ul li{

             }
         } 
      }

    }
  }

</style>
