<template>
  <div class="csAuthMessage" :class="'csAuthMessage--' + messageType">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { MessageType, type TMessage } from '@/models/Authentication';
  import type { PropType } from 'vue';
</script>

<script lang="ts">
  export default {
		props: {
      messageType: {
        type: String as PropType<TMessage>,
        default: MessageType.Info,
      },
		},
  }
</script>

<style scoped>
  .csAuthMessage {
    text-align: start;
    padding: 8px 10px;
    margin-bottom: 22px;
    transition: background-color .3s ease, color .3s ease
  }

  .csAuthMessage:empty {
    padding: 0;
    margin: 0;
  }

  .csAuthMessage--info {
    padding: 0;
  }
  .csAuthMessage--error {
    background-color: #fbd2d2;
    color: #ff0000;;
  }

  .csAuthMessage--success {
    background-color: #bddfbd;
    color: #008000;
  }

  .csAuthMessage--notice {
    background-color: #ebebeb;
  }
</style>
