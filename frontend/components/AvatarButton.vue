<template>
  <div>
    <b-avatar
      v-if="!isRunning[menOrWomen]"
      button
      size="84px"
      src="@/assets/images/avatar_silent.png"
      class="avatarButton"
      :disabled="
        !inMeeting || isRunning[menOrWomen] || number[menOrWomen] === 0
      "
      @click="$emit('click-start', $event)"
    ></b-avatar>
    <b-avatar
      v-else
      button
      size="84px"
      :src="require(`@/assets/${avatarImgSrc}`)"
      class="avatarButton"
      :disabled="
        !inMeeting || !isRunning[menOrWomen] || number[menOrWomen] === 0
      "
      @click="$emit('click-stop', $event)"
    ></b-avatar>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type IsRunningObj = {
  men: boolean
  women: boolean
}

type NumberObj = {
  men: number
  women: number
}

type MenOrWomen = 'men' | 'women'

export default Vue.extend({
  name: 'AvatarButton',
  props: {
    isRunning: {
      type: Object as PropType<IsRunningObj>,
      default: () => ({
        men: false,
        women: false,
      }),
    },
    number: {
      type: Object as PropType<NumberObj>,
      default: () => ({
        men: 0,
        women: 0,
      }),
    },
    inMeeting: {
      type: Boolean,
      default: false,
    },
    menOrWomen: {
      type: String as PropType<MenOrWomen>,
      required: true,
    },
    avatarImgSrc: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.avatarButton {
  @include solid-button($secondary);
}
</style>
