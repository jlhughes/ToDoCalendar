foam.CLASS({
  package: 'hughes.journal',
  name: 'EventStatusDAO',
  extends: 'foam.dao.ProxyDAO',

  documentation: 'CLOSE Events if when is past',

  javaImports: [
    'foam.dao.DAO',
    'foam.util.SafetyUtil'
  ],

  methods: [
    {
      name: 'put_',
      javaCode: `
      Event event = (Event) obj;
      // if ( event.getWhen() != null &&
      //      event.getWhen().getNextScheduledTime(x, null).getTime() <= System.currentTimeMillis() ) {
      //   event.setStatus(Status.CLOSED);
      // }
      return getDelegate().put_(x, event);
      `
    }
  ]
});
