foam.CLASS({
  package: 'hughes.journal',
  name: 'FollowUpSchedule',
  implements: [
    'foam.core.cron.Schedule'
  ],

  documentation: 'Schedule to create a follow-up event.',

  javaImports: [
    'foam.lang.X'
  ],

  properties: [
    {
      documentation: 'The number of follup TimeUnits',
      name: 'period',
      label: 'In',
      class: 'Int',
      value: 6,
      gridColumns: 2
    },
    {
      class: 'Enum',
      of: 'foam.time.TimeUnit',
      name: 'frequency',
      label: 'Frequency',
      value: 'MONTH',
      view: function(_, X) {
        var choices = [[foam.time.TimeUnit.DAY, 'Days'], [foam.time.TimeUnit.WEEK, 'Weeks'], [foam.time.TimeUnit.MONTH, 'Months'], [foam.time.TimeUnit.YEAR, 'Years']];
        return {
          class: 'foam.u2.view.ChoiceView',
          choices: choices,
          data$: X.data.frequency$
        }
      },
      gridColumns: 2
    }
  ],

  methods: [
    {
      name: 'getNextScheduledTime',
      type: 'Date',
      args: 'X x, java.util.Date from',
      javaCode: `
      return new java.util.Date(from.getTime() + getFrequency().getConversionFactorMs() * getPeriod());
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
