<template>
  <demo-section>


  <div id="app">
    <div>

      <van-button type="primary">Button</van-button>
      <van-cell-group>
        <van-cell title="选择单个日期" :value="date" @click="show = true" />
        <van-calendar v-model="show" @confirm="onConfirm" />
      </van-cell-group>
    </div>
  </div>
    </demo-section>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
export default {
  name: "app",
  components: {
    HelloWorld,
  },
  data() {
    return {
      date: "",
      show: false,
    };
  },
  methods: {
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.date = this.formatDate(date);
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
