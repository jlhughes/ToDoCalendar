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
    'controllerMode?',
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
    'who',
    'what',
    'where',
    'when'
  ],

  searchColumns: [
    'eventCategory',
    'status',
    'who',
    'what',
    'where',
    'why'
  ],

  properties: [
    {
      name: 'id',
      class: 'String',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO',
      order: 11,
      gridColumns: 12
    },
    {
      name: 'eventCategory',
      class: 'Reference',
      of: 'hughes.journal.EventCategory',
      label: 'Category',
      value: 'ToDo',
      order: 1,
      gridColumns: 4
    },
    {
      name: 'status',
      class: 'Enum',
      of: 'hughes.journal.Status',
      value: 'OPEN',
      order: 2,
      gridColumns: 4
    },
    {
      documentation: 'Other user access to this Event. Public - all, Private - owner and who, protected - all or owner and who if who set',
      name: 'access',
      class: 'Enum',
      of: 'hughes.journal.AccessLevel',
      value: 'PUBLIC',
      order: 3,
      gridColumns: 4
    },
    {
      name: 'who',
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      // TODO: where group journal,
      tableCellFormatter: function(value, obj) {
        var self = this;
        obj.userDAO.find(value).then(function(u) {
          if ( u ) self.add(u.toSummary());
        });
      },
      order: 4,
      gridColumns: 4
    },
    {
      name: 'what',
      class: 'String',
      required: true,
      order: 5,
      gridColumns: 4
    },
    {
      name: 'where',
      class: 'String',
      order: 6,
      gridColumns: 4
    },
    // array 'whoElse' ?
    {
      name: 'when',
      class: 'FObjectProperty',
      of: 'foam.nanos.cron.Schedule',
      factory: function() {
        return hughes.journal.CalendarSchedule.create();
      },
      tableCellFormatter: function(value, obj) {
        var self = this;
        if ( obj.when && obj.when.getNextScheduledTime ) {
          this.add(obj.when.getNextScheduledTime().toLocaleDateString(foam.locale, {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'}));
        }
      },
      order: 7,
      gridColumns: 6
    },
    {
      name: 'why',
      class: 'String',
      view: {
        class: 'foam.u2.tag.TextArea',
        rows: 5, cols: 60,
      },
      order: 8,
      gridColumns: 6
    },
    {
      name: 'transactions',
      class: 'FObjectArray',
      of: 'hughes.ledger.Transaction',
      label: 'How Much',
      createVisibility: 'RW',
      updateVisibility: function(status) {
        if ( status == this.Status.OPEN ) {
          return foam.u2.DisplayMode.RW;
        }
        return foam.u2.DisplayMode.RO;
      },
      readVisibility: function(transactions) {
        if ( transactions && transactions.length > 0 ) {
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      },
      order: 9,
      gridColumns: 6
    },
    {
      name: 'followUpAuto',
      label: 'Follow Up',
      class: 'Boolean',
      order: 10,
      gridColumns: 2,
      postSet: function(old, nu) {
        if ( ! old && nu &&
             ! this.followUpAutoSchedule ) {
          this.followUpAutoSchedule = hughes.journal.FollowUpSchedule.create();
        }
      }
    },
    {
      name: 'followUpAutoSchedule',
      class: 'FObjectProperty',
      of: 'hughes.journal.FollowUpSchedule',
      label: '',
      order: 11,
      gridColumns: 4,
      visibility: function(followUpAuto) {
        if ( followUpAuto ) {
          if ( this.controllerMode == foam.u2.ControllerMode.EDIT )
            return foam.u2.DisplayMode.RW;
          return foam.u2.DisplayMode.RO;
        }
        return foam.u2.DisplayMode.HIDDEN;
      }
    },
    {
      class: 'foam.nanos.fs.FileArray',
      name: 'attachments',
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
          files$: x.data?.attachments$,
          maxSize: 1000,
          supportedFormats: {
            '':'ANY',
            '*':'ANY'
          }
        };
      },
      order: 13,
      gridColumns: 12
    }
  ],

  methods: [
    {
      name: 'toSummary',
      type: 'String',
      code: async function() {
        var summary = this.eventCategory;
        if ( this.who ) {
          var user = await this.who$find;
          summary += " " +user.toSummary();
        }
        summary += " "+ this.what + " " + this.status;
        return summary;
      }
    },
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
        AuthService auth = (AuthService) x.get("auth");
        Subject subject = (Subject) x.get("subject");
        User user = subject.getRealUser();
        if ( this.getAccess() == AccessLevel.PRIVATE ||
             ( this.getAccess() == AccessLevel.PROTECTED  &&
               this.getWho() > 0 ) ) {
          if ( user.getId() != this.getCreatedBy() &&
               user.getId() != this.getWho() &&
               ! auth.check(x, "event.read." + this.getId()) ) {
            throw new AuthorizationException();
          }
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
             user.getId() != this.getWho() &&
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
             user.getId() != this.getWho() &&
             ! auth.check(x, "event.remove." + this.getId()) ) {
          throw new AuthorizationException();
        }
      `
    },
    {
      name: 'createFollowUp',
      type: 'Event',
      args: 'X x',
      code: function(self) {
        return hughes.journal.Event.create({
          parent: self.id,
          eventCategory: self.eventCategory,
          access: self.access,
          who: self.who,
          what: self.what,
          where: self.where,
          followUpAuto: self.followUpAuto
        });
      },
      javaCode: `
      Event followUp = new Event();
      followUp.setParent(getId());
      followUp.setEventCategory(getEventCategory());
      followUp.setAccess(getAccess());
      followUp.setWho(getWho());
      followUp.setWhat(getWhat());
      followUp.setWhere(getWhere());
      followUp.setFollowUpAuto(getFollowUpAuto());
      return followUp;
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
    },
    {
      name: 'followUp',
      isAvailable: function() {
        return this.id;
      },
      code: async function(X) {
        if ( X.memento ) {
          X = X.createSubContext({memento: X.memento.tail});
        }

        var event = X.data.createFollowUp(X.data);

        X.stack.push({
          class: 'foam.comics.v2.DAOUpdateView',
          data: event,
          config: {
            class: 'foam.comics.v2.DAOControllerConfig',
            dao: X.eventDAO,
            browseTitle: `${this.toSummary()} Follow Up`
          }
        }, X);
      }
    }
  ]
});
