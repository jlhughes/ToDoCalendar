foam.CLASS({
  package: 'hughes.journal',
  name: 'Event',

  documentation: `
- id
- status: open, closed
- what
- where
- when
  - all day: date
  - between: startdatetime, enddatetime
  - schedule: schedule
- who, [whoElse?]
- why
- ledger: income/expense, value
- attachments
- category, [additional categories?]
- parent/child relationship

category
- name
- colour
- notification

categories
- todo
- appointment
- job
- purchase
- grocery
..
 `,

  implements: [
    'foam.nanos.auth.Authorizable',
    'foam.nanos.auth.CreatedAware',
    'foam.nanos.auth.CreatedByAware',
    'foam.nanos.auth.LastModifiedAware',
    'foam.nanos.auth.LastModifiedByAware'
  ],

  imports: [
    'controllerMode',
    'currencyDAO',
    'eventDAO',
    'userDAO'
  ],

  requires: [
    'foam.dao.AbstractDAO',
    'foam.log.LogLevel',
    'foam.nanos.auth.AuthorizationException',
    'foam.nanos.auth.AuthService',
    'foam.nanos.auth.Subject',
    'foam.nanos.auth.User',
    'hughes.journal.AccessLevel',
    'hughes.journal.EventCategory',
    'hughes.journal.LedgerCategory',
    'hughes.journal.WhenChoice',
    'hughes.journal.Status'
  ],

  javaImports: [
    'foam.core.X',
    'foam.dao.DAO',
    'foam.nanos.auth.AuthorizationException',
    'foam.nanos.auth.AuthService',
    'foam.nanos.auth.Subject',
    'foam.nanos.auth.User'
  ],

  messages: [
    {
      name: 'SUCCESS_CLOSED',
      message: 'Successfully closed'
    }
  ],

  tableColumns: [
    'eventCategory',
    'status',
    'what',
    'when'
  ],

  searchColumns: [
    'eventCategory',
    'status'
  ],

  // sections: [
  //   {
  //     name: 'whatSection'
  //   },
  //   {
  //     name: 'whereSection'
  //   },
  //   {
  //     name: 'whenSection'
  //   },
  //   {
  //     name: 'whySection'
  //   },
  //   {
  //     name: 'whoSection'
  //   },
  //   {
  //     name: 'ledgerSection'
  //   },
  //   {
  //     name: 'attachmentSection'
  //   },
  //   {
  //     name: 'accessSection'
  //   }
  //   {
  //     name: 'parentInformation'
  //   },
  //   {
  //     name: 'userInformation'
  //   }
  // ],

  properties: [
    {
      name: 'eventCategory',
      class: 'Reference',
      of: 'hughes.journal.EventCategory',
      label: 'Category',
      value: 'ToDo',
      section: 'whatSection',
      gridColumns: 6
    },
    // additional categories
    {
      name: 'status',
      class: 'Enum',
      of: 'hughes.journal.Status',
      value: 'OPEN',
      section: 'whatSection',
      gridColumns: 6
    },
    {
      name: 'what',
      class: 'String',
      required: true,
      section: 'whatSection'
    },
    {
      name: 'where',
      class: 'String',
      section: 'whereSection'
    },
    {
      name: 'when',
      class: 'Enum',
      of: 'hughes.journal.WhenChoice',
      value: 'ALL_DAY',
      section: 'whenSection',
      gridColumns: 6
    },
    {
      name: 'date',
      class: 'Date',
      visibility: function(when) {
        if ( when ==  this.WhenChoice.ALL_DAY ) {
          if ( !this.controllerMode || this.controllerMode == 'EDIT' ) {
            return foam.u2.DisplayMode.RW;
          }
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      section: 'whenSection',
      gridColumns: 6
    },
    {
      name: 'startDateTime',
      class: 'DateTime',
      visibility: function(when) {
        if ( when ==  this.WhenChoice.BETWEEN ) {
          if ( !this.controllerMode || this.controllerMode == 'EDIT' ) {
            return foam.u2.DisplayMode.RW;
          }
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      section: 'whenSection',
      gridColumns: 6
    },
    {
      name: 'endDateTime',
      class: 'DateTime',
      visibility: function(when) {
        if ( when ==  this.WhenChoice.BETWEEN ) {
          if ( !this.controllerMode || this.controllerMode == 'EDIT' ) {
            return foam.u2.DisplayMode.RW;
          }
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      section: 'whenSection',
      gridColumns: 6
    },
    {
      name: 'schedule',
      class: 'FObjectProperty',
      of: 'foam.nanos.cron.Schedule',
      visibility: function(when) {
        if ( when ==  this.WhenChoice.SCHEDULE ) {
          if ( !this.controllerMode || this.controllerMode == 'EDIT' ) {
            return foam.u2.DisplayMode.RW;
          }
          // TOOD: some summary view
          return foam.u2.DisplayMode.HIDDEN;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      view: {
        class: 'foam.u2.view.FObjectView',
        of: 'foam.nanos.cron.Schedule'
      },
      section: 'whenSection'
    },
    {
      name: 'who',
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      section: 'whoSection'
      // TODO: where group journal
    },
    // array 'whoElse' ?
    {
      name: 'why',
      class: 'Code',
      view: {
        class: 'foam.u2.tag.TextArea',
        rows: 4, cols: 60,
      },
      section: 'whySection'
    },
    {
      name: 'ledgerCategory',
      class: 'Enum',
      of: 'hughes.journal.LedgerCategory',
      label: 'Ledger',
      value: 'NA',
      section: 'ledgerSection',
      gridColumns: 6
    },
    {
      name: 'ledgerValue',
      class: 'UnitValue',
      unitPropName: 'currency',
      label: 'Amount',
      section: 'ledgerSection',
      gridColumns: 6,
      visibility: function(ledgerCategory) {
        if ( ledgerCategory == this.LedgerCategory.NA ) {
          return foam.u2.DisplayMode.HIDDEN;
        }
        if ( !this.controllerMode || this.controllerMode == 'EDIT' ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.RO;
      },
    },
    {
      class: 'Reference',
      name: 'currency',
      of: 'foam.core.Currency',
      targetDAO: 'currencyDAO',
      value: 'CAD',
      visibility: 'HIDDEN',
      section: 'ledgerSection'
    },
    {
      class: 'foam.nanos.fs.FileArray',
      name: 'attachments',
      section: 'attachmentSection',
      tableCellFormatter: function(files) {
        if ( ! (Array.isArray(files) && files.length > 0) ) return;
        var actions = files.map((file) => {
          return foam.core.Action.create({
            label: file.filename,
            code: function() {
              window.open(file.address, '_blank');
            }
          });
        });
        this.tag({
          class: 'foam.u2.view.OverlayActionListView',
          data: actions,
          obj: this,
          icon: '/images/attachment.svg',
          showDropdownIcon: false
        });
      },
      view: function(_, x) {
        return {
          class: 'foam.nanos.fs.fileDropZone.FileDropZone',
          files$: x.data.attachments$,
          supportedFormats: {
            '*' : 'Any'
          }
        };
      }
    },
    {
      name: 'id',
      class: 'String',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO',
      section: 'userInformation',
      gridColumns: 6
    },
    {
      documentation: 'Other user access to this Event',
      name: 'access',
      class: 'Enum',
      of: 'hughes.journal.AccessLevel',
      value: 'PRIVATE',
      section: 'userInformation',
      gridColumns: 6
    }
  ],

  methods: [
    {
      name: 'authorizeOnCreate',
      args: 'X x',
      javaThrows: ['AuthorizationException'],
      javaCode: `
        // nop - anyone can create
      `
    },
    {
      name: 'authorizeOnRead',
      args: 'X x',
      javaThrows: ['AuthorizationException'],
      javaCode: `
        if ( this.getAccess() == AccessLevel.PUBLIC ) return;
        // TODO: protected

        AuthService auth = (AuthService) x.get("auth");
        Subject subject = (Subject) x.get("subject");
        User user = subject.getRealUser();
        if ( user.getId() != this.getCreatedBy() &&
             user.getId() != this.getWho() &&
             ! auth.check(x, "event.read." + this.getId()) ) {
          throw new AuthorizationException();
        }
      `
    },
    {
      name: 'authorizeOnUpdate',
      args: 'X x',
      javaThrows: ['AuthorizationException'],
      javaCode: `
        AuthService auth = (AuthService) x.get("auth");
        Subject subject = (Subject) x.get("subject");
        User user = subject.getRealUser();
        if ( user.getId() != this.getCreatedBy() &&
             ! auth.check(x, "event.update." + this.getId()) ) {
          throw new AuthorizationException();
        }
      `
    },
    {
      name: 'authorizeOnDelete',
      args: 'X x',
      javaThrows: ['AuthorizationException'],
      javaCode: `
        AuthService auth = (AuthService) x.get("auth");
        Subject subject = (Subject) x.get("subject");
        User user = subject.getRealUser();
        if ( user.getId() != this.getCreatedBy() &&
             ! auth.check(x, "event.remove." + this.getId()) ) {
          throw new AuthorizationException();
        }
      `
    }
  ],

  actions: [
    {
      name: 'close',
      isAvailable: function() {
        return this.status == this.Status.OPEN;
      },
      code: function(X) {
        var event = this.clone();
        event.status = this.Status.CLOSED;

        this.eventDAO.put(event).then(req => {
          this.eventDAO.cmd(this.AbstractDAO.PURGE_CMD);
          this.eventDAO.cmd(this.AbstractDAO.RESET_CMD);
          this.finished.pub();
          X.notify(this.SUCCESS_CLOSED, '', this.LogLevel.INFO, true);
        }, e => {
          this.throwError.pub(e);
          X.notify(e.message, '', this.LogLevel.ERROR, true);
        });
      }
    }
  ]
});
