<script setup lang="ts">
import { getModeListByDeviceId, getMyHomeDeviceList } from "@/http/api";
const Login = async () => {
  try {
    const data = await getMyHomeDeviceList();
    const data1 = await getModeListByDeviceId(730);
    console.log(data, data1);
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <div>
    <button>测试</button>
  </div>
</template>
<style lang="less" scoped></style>
