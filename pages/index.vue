<template>
  <div>
    <!--App Bar with Title and Login Button. (Used to have it as component however adding login button to app bar makes UI look cleaner)-->
    <v-app-bar dense dark fixed flat>
      <v-spacer />
      <v-toolbar-title color="deep-purple accent-4" class="align">
        <span :class="$vuetify.breakpoint.smAndDown ? 'subtitle-1' : 'headline'">Hackathon Global Inc.&#8482; Event Schedule </span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        small
        outlined
        color="white"
        class="ml-3"
        @click="goLogin"
      >
        {{ logIn() ? 'Logout':'Login' }}
      </v-btn>
    </v-app-bar>

    <!--Body Component with Calendar UI -->
    <body class="white pb-16 pt-10">
      <v-row align="center" justify="center" class="white mb-0 pb-0 pt-16 mt-0">
        <v-col cols="10" align="center" justify="center" class="ma-0 pa-0 grey darken-4">
          <!--Tool Bar on Calendar with Arrows to Move Between Days-->
          <v-toolbar dense class="pa-0 ma-0">
            <v-btn
              fab
              text
              small
              color="white"
              :disabled="leftDisabled"
              @click="prev"
            >
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
              fab
              text
              small
              color="white"
              :disabled="rightDisabled"
              @click="next"
            >
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <!-- Date Indicator: Given Day in Hackathon -->
            <v-toolbar-title class="white--text pl-3 pb-0">
              <strong>Day {{ 1 + dateInd }}</strong> - {{ readTimes[dateInd] }}
            </v-toolbar-title>
          </v-toolbar>
        </v-col>
      </v-row>
      <!--Calendar Component with Parameters of Variables-->
      <v-row align="center" justify="center" class="white mt-0 pa-0 pb-12">
        <v-col cols="10" align="center" justify="center" class="mt-0 mb-1 grey darken-4 pa-0">
          <v-sheet fluid class="pa-0 mt-0" height="60vh">
            <v-calendar
              ref="calendar"
              v-model="focus"
              type="day"
              height="10"
              class="grey darken-4"
              hide-header
              :events="cEvents"
              @click:event="showEvent"
            />
          </v-sheet>
        </v-col>
      </v-row>
    </body>
    <!--Dialog Box for Pop Up of Event Data (when selected)-->
    <v-dialog v-model="dialog" max-width="600">
      <v-card class="white">
        <v-list-item three-line class="pr-5">
          <v-list-item-content>
            <v-card-text v-if="eventData.speaker !== null" class="overline pl-3 pt-1 pb-0 font-weight-light black--text">
              {{ eventData.speaker }}'s {{ eventTypes[eventData.type] }}
            </v-card-text>
            <v-card-text v-if="eventData.speaker === null" class="overline pl-3 pt-1 pb-0 font-weight-light black--text">
              {{ eventTypes[eventData.type] }}
            </v-card-text>
            <v-card-title class="text-wrap pt-0 pl-2 pb-0 title black--text text-xs-center">
              {{ eventData.name }}
            </v-card-title>
            <v-card-text class="change-fsize pl-2 pt-0 pb-0 font-weight-normal black--text">
              Time: {{ eventData.timestamp }}
            </v-card-text>
          </v-list-item-content>
          <v-avatar v-if="eventData.pic !== null" center color="grey darken-4" size="70">
            <img
              :src="eventData.pic"
              :alt="eventData.speaker"
            >
          </v-avatar>
        </v-list-item>

        <v-card-text class="black--text pb-0 text-caption">
          {{ eventData.descrip }}
        </v-card-text>
        <!--Related Activities with Event Chips-->
        <v-card-text v-if="relatedEvents.length" class="overline pl-6 pt-2 pb-0 font-weight-normal black--text">
          Related Activities
        </v-card-text>
        <v-chip-group v-if="relatedEvents.length" class="px-6 pt-0 text-center" center-active column>
          <v-chip
            v-for="(event, index) in relatedEvents"
            :key="index"
            x-small
            color="grey darken-4"
            class="mx-1 mb-1 mt-0 pt-0"
            align="center"
            @click.stop="switchEvent(event)"
          >
            {{ event }}
          </v-chip>
        </v-chip-group>
        <!--Links to Event-->
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="black"
            text
            :href="eventData.link"
            target="_blank"
            @click="dialog = false"
          >
            Go To Event
          </v-btn>
          <v-btn
            color="black"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      dialog: false,
      focus: '2021-01-12',

      // Events Initialized and Event Maps
      events: [], // All Events (Ind -> Event)
      eventIds: {}, // Events Map (ID -> Event)
      eventsbyId: {}, // Events Map (Ind -> ID)
      cEvents: [], // Events that are taken by Calendar Component for Display

      visibleEvents: [], // Events visible to current user (either publicEvents when not LoggedIn or events when loggedIn)
      publicEvents: [], // Public Events (Events Visible to Public)

      // Constant Dictionary Values for Setup
      fullDates: { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' },
      event_color: { workshop: 'orange', activity: 'purple', tech_talk: 'blue' },
      eventTypes: { workshop: 'Workshop', activity: 'Activity', tech_talk: 'Tech Talk' },

      // Times of Events
      times: [], // Times in ISO String Format for each day in hackathon
      readTimes: [], // Times in a readable string format for each day in hackatho

      // Active Event when event on calendar is clicked
      activeEvent: undefined,

      // Active Event Data
      eventData: {},
      // Related Events to the Active Event
      relatedEvents: [],

      // Date Indexes with Respect to events
      dateInd: 0,
      maxDateInd: 0,

      // Disabling Arrows for Changing Days when at Extremes
      leftDisabled: true,
      rightDisabled: false
    }
  },
  computed: {

  },
  async mounted () { // Function for getting data for all events
    const endPoint = 'https://api.hackthenorth.com/v3/graphql?query='
    const query = `{
        events {
          id
          name
          event_type
          permission
          start_time 
          end_time
          description
          speakers {
            name
            profile_pic
          }
          public_url
          private_url
          related_events
        }
      }
    `
    const resp = await axios.get(endPoint + query)
    this.events = resp.data.data.events
    this.initEvents()
    setTimeout(() => { this.setTimes() }, 10)
  },
  methods: {
    logIn () { // Log In Variable Function from Localized Store
      return this.$store.state.auth.loggedIn
    },
    goLogin (e) { // Login Function that Routes to auth.vue
      if (this.logIn()) {
        this.$store.commit('auth/setloggedIn', false)
        this.visibleEvents = this.publicEvents
        this.setTimes()
        this.leftDisabled = true
        this.rightDisabled = false
      } else {
        this.$router.push('./auth')
        this.visibleEvents = this.events
        this.setTimes()
      }
    },
    prev () { // Go to previous date in calendar
      if (this.dateInd !== 0) {
        this.dateInd -= 1
        this.focus = this.times[this.dateInd]
        this.rightDisabled = false
        if (this.dateInd === 0) {
          this.leftDisabled = true
        }
      }
    },
    next () { // Go to next date in calendar
      if (this.dateInd !== this.maxDateInd) {
        this.dateInd += 1
        this.focus = this.times[this.dateInd]
        this.leftDisabled = false
        if (this.dateInd === this.maxDateInd) {
          this.rightDisabled = true
        }
      }
    },
    switchEvent (chip) { // Switch Event to a Related Event
      this.makeCard(chip)
    },
    showEvent ({ nativeEvent, event }) { // Show Event (@Click from Calendar)
      this.activeEvent = event
      this.makeCard(event.name)
    },
    stringifyDate (unixTime) { // Unix Date to Nice Readable Format ([12-hour Clock Time] on [Day of Week], [Month Abbrev.] [Day])
      const date = new Date(unixTime)
      const time = date.toLocaleTimeString('en-US').split(' ', 2)
      const dTime = time[0].split(':', 3)
      const stringTime = dTime[0] + ':' + dTime[1] + ' ' + time[1]
      const stringDate = date.toDateString().split(' ', 4)
      return stringTime + ' on ' + stringDate[0] + ', ' + stringDate[1] + '. ' + stringDate[2]
    },
    makeCard (eventName) { // Set all Data in Dialog Cart to Data with eventName
      const eventId = this.eventsbyId[this.eventIds[eventName]]
      const eventInfo = this.events[eventId]
      this.eventData.name = eventInfo.name
      this.eventData.type = eventInfo.event_type
      if (eventInfo.speakers.length === 0) {
        this.eventData.speaker = null
        this.eventData.pic = null
      } else if (eventInfo.profile_pic === null) {
        this.eventData.pic = null
        this.eventData.speaker = eventInfo.speakers[0].name
      } else {
        this.eventData.speaker = eventInfo.speakers[0].name
        this.eventData.pic = eventInfo.speakers[0].profile_pic
      }
      this.eventData.descrip = eventInfo.description
      this.eventData.link = (this.logIn()) ? eventInfo.private_url : eventInfo.public_url
      this.relatedEvents = []
      this.eventData.timestamp = this.stringifyDate(eventInfo.start_time) + ' to ' + this.stringifyDate(eventInfo.end_time)
      for (const e in eventInfo.related_events) {
        const linkedId = eventInfo.related_events[e]
        const eventInd = this.eventsbyId[linkedId]
        if (this.logIn() || (!this.logIn() && this.events[eventInd].permission === 'public')) {
          this.relatedEvents.push(this.events[eventInd].name)
        }
      }
      this.dialog = true
    },
    setTimes () { // Set times for calendar, reset everytime user (Logs In/Out)
      this.cEvents = []
      this.times = []
      this.readTimes = []
      for (const event in this.visibleEvents) {
        const sTime = new Date(this.events[event].start_time)
        const eTime = new Date(this.events[event].end_time)
        this.cEvents.push({
          name: this.events[event].name,
          start: sTime,
          end: eTime,
          color: this.event_color[this.events[event].event_type],
          timed: true
        })
        this.times.push(sTime)
        this.times.push(eTime)
      }
      this.times = this.times.sort((a, b) => a - b)
      const tempTimes = []
      for (const t in this.times) {
        const year = this.times[t].getFullYear()
        const month = this.times[t].getMonth() + 1
        const day = this.times[t].getDate()
        const stringMonth = (month > 9 ? '' : '0') + month.toString()
        const stringDay = (day > 9 ? '' : '0') + day.toString()
        const stringDate = year.toString() + '-' + stringMonth + '-' + stringDay
        tempTimes.push(stringDate)
      }
      const uniq = [...new Set(tempTimes)]
      this.times = uniq

      this.readTimes = []
      for (const t in this.times) {
        const isoString = this.times[t]
        const time = isoString.split('-', 3)
        const y = parseInt(time[0])
        const mm = parseInt(time[1])
        const dd = parseInt(time[2])
        const readTime = new Date(y, mm - 1, dd, 12, 0, 0).toDateString().split(' ', 4)
        this.readTimes.push(this.fullDates[readTime[0]] + ', ' + readTime[1] + '. ' + readTime[2])
      }

      this.dateInd = 0
      this.maxDateInd = this.times.length - 1
      this.focus = this.times[this.dateInd]
    },
    initEvents () { // Initialize Events on Once at Beginning
      this.eventIds = []
      this.publicEvents = []
      for (const event in this.events) {
        this.eventIds[this.events[event].name] = this.events[event].id
        this.eventsbyId[this.events[event].id] = event
        if (this.events[event].permission === 'public') {
          this.publicEvents.push(this.events[event])
        }
      }
      if (!this.logIn()) {
        this.visibleEvents = this.publicEvents
      } else {
        this.visibleEvents = this.events
      }
    }
  }
}
</script>
<style scoped>
body {
  overflow: hidden;
  height: 100vh;
}
.change-fsize {
  font-size: 0.7em;
}
</style>
