foam.CLASS({
  package: 'hughes.journal',
  name: 'FollowUpAutoAgent',
  implements: [
    'foam.core.ContextAgent',
  ],

  documentation: `Create a follow-up Event for events
- followUpAuto: true
- status: Closed
- no follow ups
`,

  javaImports: [
    'foam.core.Detachable',
    'foam.core.X',
    'foam.dao.DAO',
    'foam.dao.Sink',
    'static foam.mlang.MLang.*',
    'foam.mlang.sink.Count',
    'foam.nanos.cron.Schedule'
  ],

  methods: [
    {
      name: 'execute',
      args: 'X x',
      javaCode: `
      DAO dao = (DAO) x.get("eventDAO");
      dao = dao.where(
        AND(
          EQ(Event.FOLLOW_UP_AUTO, true),
          EQ(Event.STATUS, Status.CLOSED)
        )
      );
      dao.select(new Sink() {
        public void put(Object obj, Detachable sub) {
          Event event = (Event) obj;
          DAO children = event.getChildren(x);
          if ( ((Count) children.select(COUNT())).getValue() == 0 ) {
            if ( ((Schedule)event.getFollowUpAutoSchedule()).getNextScheduledTime(x, ((CalendarSchedule)event.getWhen()).getStartDate()).getTime() < System.currentTimeMillis()) {
              Event followUp = event.createFollowUp(x);
              children.put(followUp);
            }
          }
        }
        public void remove(Object obj, Detachable sub) {}
        public void eof() {}
        public void reset(Detachable sub) {}
      });
      `
    }
  ]
});
