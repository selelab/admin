<template>
  <div class="campaign_box">
    <br />
    <p v-html="text"></p>
    <router-link to="/projects/create" class="button">
      <p>こちらをクリック！</p>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    text: String
  }
};
</script>

<style>
.campaign_box {
  height: 250px;
  width: 100%;
  max-width: 380px;
  background: #808080;
  color: white;
  padding: 20px;
  position: relative;
  top: 150px;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

.campaign_box .button {
  box-shadow: inset 0px 3px 0px 0px #cf866c;
  background: linear-gradient(to bottom, #d0451b 5%, #bc3315 100%);
  background-color: #d0451b;
  border-radius: 6px;
  border: 1px solid #942911;
  display: inline-block;
  color: #ffffff;
  font-family: Arial;
  font-size: 17px;
  padding: 10px 24px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #854629;
}

.campaign_box .button:hover {
  background: linear-gradient(to bottom, #bc3315 5%, #d0451b 100%);
  background-color: #bc3315;
}

.campaign_box .button:active {
  position: relative;
  top: 1px;
}
</style>