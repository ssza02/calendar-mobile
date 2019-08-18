<template>
    <transition name="fade">  
      <div v-if="shadow" class="action-sheet">
        <div class="shadow" @click="shadow=false"></div>
        <div class="sheet-wrap">
          <div class="sheet">
            <div class="hd">
              <span><input type="button" class="transparent cancel" value="取消" @click="shadow=false"></span>
              <span class="sheet-title">{{pickerName}}</span>
              <span><input type="button" class="transparent confirm" value="确定" @click="submit()"></span>
            </div>
          </div>
        </div>
      </div>  
    </transition>  
</template>

<script>
export default {
  name: 'picker',
  props: ['pickerName'],
  data () {
      return {
        shadow:false,
        
      }
    },
  methods:{
    submit(){

    }
  }  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .action-sheet{
    position: fixed;
    top:0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    .shadow{
      position: absolute;
      left: 0;
      top:0;
      bottom: 0;
      background: rgba(0,0,0,0.50);
      z-index: 9;
    }
    .sheet-wrap{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2.63rem;
      border-radius: 0.08rem 0.08rem 0 0;
      background: #fff;
      overflow: hidden;
      z-index: 99;
      .sheet{
        .hd{
          display: flex;
          justify-content: space-between;
          padding: 0 0.12rem;
          background: #F7F7F9;
          span{
            display: inline-flex;
            line-height: 0.44rem;
          }
          input{
            display: block;
          }
          .sheet-title{
            font-size: 16px;
            color: #333;
          }
          .cancel{
            color: #999;
          }
          .confirm{
            color: #5054F4;
          }
        }
      }
    }

  } 
</style>
