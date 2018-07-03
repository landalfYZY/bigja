<template>
    <div>
        <div>使用前，请确保蓝牙已开启</div>
        <div style="line-height:50px" class="font-grey">未配对任何设备</div>
        <div><Button type="ghost" :loading="loading" @click="searchDevices()">{{loading ? '正在搜索设备':'搜索设备'}}</Button></div>
    </div>
</template>
<script>
var that;
export default {
  data() {
    return {
      loading: false,
      address: "",
      list1: [],
      list2: []
    };
  },
  mounted() {
    that = this;
    this.browserRedirect()
  },
  methods: {
    browserRedirect() {
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      if ( bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM ) {
       console.log("PHONE");
      } else {
        console.log("PC");
      }
    },
    searchDevices() {
      var bluetoothTool = new BluetoothTool();
      var mainActivity = plus.android.runtimeMainActivity();
    }
  }
};
</script>
