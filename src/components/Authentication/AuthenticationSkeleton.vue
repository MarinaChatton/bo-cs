<template>
  <div class="csAuth__logo">
    <img :src="logoSrc" />
  </div>
  <div class="csAuth__title">
    <slot name="title"></slot>
  </div>
  <slot name="default"></slot>
</template>

<script lang="ts">
  export default {
    props: {
      logo: {
        type: String,
        default: 'logo-wg-dark.svg',
      },
      isLogoFromAssets: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      logoSrc(): string {
        return this.isLogoFromAssets ? './src/assets/' + this.logo : this.logo;
      },
    },
  };
</script>

<style scoped>
  .csAuth__logo {
    position: relative;
  }

  .csAuth__logo:after {
    content: '';
    display: block;
    margin: 15px 0 20px;
    border-bottom: 1px solid var(--csBo-authModalInner_separator);
  }

  .csAuth__logo img {
    height: 60px;
    width: 100%;
    object-fit: contain;
    object-position: center;
  }

  .csAuth__title:not(:empty) {
    text-align: start;
    font-size: 20px;
    margin: 20px 0;
  }

  .csAuth__title strong {
    font-weight: bold;
  }
</style>

<style>
  :root {
    --csBo-authModalInner_separator: var(--csBo_color4);
  }
</style>
