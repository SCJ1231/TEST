<template>
  <header>{{ newData }}
  </header>
</template>
<script>
import HotContent from '@/components/hot.js'
export default {
  name: HotContent,
  componets: {
    HotContent
  },
  data() {
    return {
      newData: ''
    }
  },
  mounted() {
    this.newData = HotContent
    console.log(newData)
  }
}
</script>
<style scoped>
header {
  text-align: center;
  padding: 25px;
  border: 1px solid gray;
  background-color: floralwhite;
}
</style>
