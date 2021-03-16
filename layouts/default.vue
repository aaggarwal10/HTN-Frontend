<template>
  <v-app color="white">
    <nuxt />
    <v-footer padless overflow-hidden app fixed dense>
      <v-card
        flat
        width="100%"
        class="grey darken-4 white--text text-center"
      >
        <span class="white--text text-caption pb-1">
          Copyright Hackathon Global &#8482; - {{ new Date().getFullYear() }}
        </span>
      </v-card>
    </v-footer>
  </v-app>
</template>
