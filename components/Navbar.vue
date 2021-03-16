<template>
  <v-app-bar dense dark fixed flat>
    <v-spacer />
    <v-toolbar-title>
      <span :class="$vuetify.breakpoint.smAndDown ? 'subtitle-1' : 'headline'">Hackathon Global Inc.&#8482; Event Schedule </span>
    </v-toolbar-title>
    <v-spacer />
  </v-app-bar>
</template>
<script>
export default {
  name: 'Navbar'
}
</script>
