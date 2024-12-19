foam.CLASS({
  package: 'hughes.journal',
  name: 'CalendarSchedule',
  implements: [
    'foam.nanos.cron.Schedule'
  ],

  documenation: 'Schedule for day and time duration',

  javaImports: [
    'foam.core.X'
  ],

  properties: [
    {
      name: 'startDate',
      class: 'Date',
      section: 'scheduleSection',
      gridColumns: 3,
      postSet: function(old, nu) {
        if ( ! this.endDate || nu.getTime() > this.endDate.getTime() ) {
          this.endDate = nu;
        }
      }
    },
    {
      name: 'startTime',
      class: 'String', // 'Time',
      view: { class: 'foam.u2.TimeView' },
      postSet: function(old, nu) {
        var d = this.parseTime(nu);
        if ( ! old ) {
          d.setTime(d.getTime() + 30*60000);
          this.endTime = this.formatTime(d);
        }
        // TODO: test startDate, endDate
      },
      createVisibility: function(allDay) {
        if ( ! allDay ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      updateVisibility: function(allDay) {
        if ( ! allDay ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      readVisibility: function(allDay) {
        if ( ! allDay ) {
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      section: 'scheduleSection',
      gridColumns: 3
    },
    {
      name: 'endDate',
      class: 'Date',
      section: 'scheduleSection',
      gridColumns: 3,
      postSet: function(old, nu) {
        if ( this.startDate && nu.getTime() < this.startDate.getTime() ) {
          this.endDate = this.startDate;
        }
      }
    },
    {
      name: 'endTime',
      class: 'String', // 'Time',
      view: { class: 'foam.u2.TimeView' },
      // TODO: next hour
      // factory: function() { return foam.core.Time.create(); },
      createVisibility: function(allDay) {
        if ( ! allDay ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      updateVisibility: function(allDay) {
        if ( ! allDay ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      readVisibility: function(allDay) {
        if ( ! allDay ) {
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      section: 'scheduleSection',
      gridColumns: 3
    },
    {
      name: 'allDay',
      class: 'Boolean',
      value: true,
      section: 'scheduleSection',
      gridColumns: 3
    }
  ],

  methods: [
    {
      name: 'toSummary',
      type: 'String',
      code: function() {
        return this.getNextScheduledTime();
      }
    },
    {
      name: 'getNextScheduledTime',
      type: 'Date',
      args: 'X x, java.util.Date from',
      code: function() {
        return this.startDate;
      },
      javaCode: `
      return getStartDate();
      `
    },
    {
      name: 'postExecution',
      javaCode: `
        // nop
      `
    },
  //   {
  //     documentation: 'Build DateTime from startDate and startTime',
  //     name: 'getStartDateTime',
  //     type: 'DateTime',
  //     code: function() {
  //     }
  //   },
  //   {
  //     documentation: 'Build DateTime from endDate and endTime',
  //     name: 'getStartDateTime',
  //     type: 'DateTime',
  //     code: function() {
  //     }
  //   }
    /**
     * Parse time from a String and optionally set the decoded time into the argument date.
     * supports input formats: h, hh, hh:mm, h pm, hh:mm pm, ....
     */
    function parseTime(time, date = new Date()) { // hh[:mm] [am|pm]
      var t = time.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
      date.setHours( parseInt( t[1]) + (t[3] ? 12 : 0) );
      date.setMinutes( parseInt( t[2]) || 0 );
      return date;
    },
    /**
     * return date's time as string in format: hh:mm (by default)
     */
    function formatTime(date, options = { hour12: false, hour: '2-digit', minute: '2-digit' }) {
      return date.toLocaleTimeString(foam.locale, options);
    }
  ]
})
