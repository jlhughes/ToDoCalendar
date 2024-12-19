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
        var d = foam.Date.parseTime(nu);
        if ( ! old ) {
          d.setTime(d.getTime() + 30*60000);
          this.endTime = foam.Date.formatTime(d);
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
    },
    {
      documentation: 'Demonstration only - do show DateTime properties that will not save, or display properly in RO mode',
      name: 'otherDateTime1',
      class: 'DateTime',
      section: 'scheduleSection',
      gridColumns: 3,
      postSet: function(old, nu) {
        if ( ! this.otherDateTime2 || nu.getTime() > this.otherDateTime2.getTime() ) {
          this.otherDateTime2 = nu;
        }
      }
    },
    {
      documentation: 'Demonstration only - do show DateTime properties that will not save, or display properly in RO mode',
      name: 'otherDateTime2',
      class: 'DateTime',
      section: 'scheduleSection',
      gridColumns: 3,
      postSet: function(old, nu) {
        if ( this.otherDateTime1 && nu.getTime() < this.otherDateTime1.getTime() ) {
          this.otherDateTime2 = this.otherDateTime1;
        }
      }
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
  ]
})
