foam.CLASS({
  package: 'hughes.journal',
  name: 'DaySchedule',
  implements: [
    'foam.nanos.cron.Schedule'
  ],

  documenation: 'Schedule for one day, optionally at a particular time',

  javaImports: [
    'foam.core.X',
  ],

  properties: [
    {
      name: 'date',
      class: 'Date',
      factory: function() { return Date.now(); },
      section: 'scheduleSection',
      gridColumns: 2
    },
    {
      name: 'allDay',
      class: 'Boolean',
      value: true,
      section: 'scheduleSection',
      gridColumns: 2
    },
    {
      name: 'time',
      class: 'String', // 'Time',
      view: { class: 'foam.u2.TimeView' },
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
      gridColumns: 2
    }
  ],

  methods: [
    {
      name: 'getNextScheduledTime',
      type: 'DateTime',
      args: 'X x, java.util.Date from',
      javaCode: `
      return getDate();
      `
    },
    {
      name: 'postExecution',
      javaCode: `
        // nop
      `
    }
  ]
})
