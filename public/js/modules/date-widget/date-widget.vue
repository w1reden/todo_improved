<template>
  
  <div class="g-current-date-wrap">
    <div class="g-current-day">{{currentDate | zero}}</div>
    <div class="g-month-wrap">
      <div class="g-current-month">{{currentMonth}}</div>
      <div class="g-current-weekday">{{currentDay}}</div>
    </div>
  </div>

</template>

<script>
  import { weekdayFull } from '../../utils/date-utils.js';
  
  export default {
    props: ['defaultDate'],

    filters: {
      'zero': function(value) {
        return value.toString().length > 1 ? value : `0${value}`;
      }
    },

    data: function() {
      return {
        date: new Date(),
        monthNames: `January February March April May
                     June July August September October
                     November December`.split(/\s+/),
      };
    },
    
    computed: {
      currentDate: function() {
        if (this.defaultDate)
          return this.defaultDate.getDate();
        else
          return this.date.getDate();
      },
      currentMonth: function() {
        if (this.defaultDate)
          return this.monthNames[this.defaultDate.getMonth()];
        else
          return this.monthNames[this.date.getMonth()];
      },
      currentDay: function() {
        return weekdayFull(this.defaultDate || this.date);
      },
    }
  }

</script>