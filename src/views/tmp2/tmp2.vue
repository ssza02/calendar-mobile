<template>
  <div class="home">
    <header>
        
    </header>
    <body>
        <div class="inin">12312312312</div>
    </body>
    <footer></footer>
  </div>
</template>

<script>
  //import logo from 'assets/img/logo.png'
  //import modal from 'components/modal.vue'
  import Lib from "../../assets/js/Lib";
  export default {
    components: {
      //modal
    },
    mounted() {
      Lib.M.baseDomFn();
    },
    data () {
      return {
        // logoImg: logo,
      }
    },
    created () {
      Lib.M.baseFn();
    },
    methods: {

    }
  }
</script>

<style lang="less">
@import "../../assets/css/m_base.less";
  .inin{
      width: 1rem;
      height: 1rem;
  }
</style>
