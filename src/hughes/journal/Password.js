foam.CLASS({
  package: 'hughes.journal',
  name: 'Password',

  documentation: ``,

  implements: [
    'foam.core.auth.Authorizable',
    'foam.core.auth.CreatedAware',
    'foam.core.auth.CreatedByAware',
    'foam.core.auth.LastModifiedAware',
    'foam.core.auth.LastModifiedByAware'
  ],

  imports: [
    'userDAO'
  ],

  requires: [
    'hughes.journal.AccessLevel'
  ],

  javaImports: [
    'foam.lang.X',
    'foam.core.auth.AuthorizationException',
    'foam.core.auth.AuthService',
    'foam.core.auth.Subject',
    'foam.core.auth.User',
  ],

  tableColumns: [
    'owner',
    'description',
    'site'
  ],

  searchColumns: [
    'owner',
    'description',
    'site',
    'loginId',
    'username'
  ],

  properties: [
    {
      name: 'id',
      class: 'String',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO',
      gridColumns: 4
    },
    {
      name: 'owner',
      class: 'Reference',
      of: 'foam.core.auth.User',
      tableCellFormatter: function(value, obj) {
        var self = this;
        obj.userDAO.find(value).then(function(u) {
          if ( u ) self.add(u.toSummary());
        });
      },
      gridColumns: 4
    },
    {
      documentation: 'Other user access to this Event. Public - all, Private - owner and who, protected - all or owner and who if who set',
      name: 'access',
      class: 'Enum',
      of: 'hughes.journal.AccessLevel',
      value: 'PRIVATE',
      gridColumns: 4
    },
    {
      name: 'description',
      class: 'String',
      required: true,
      gridColumns: 4,
    },
    {
      name: 'password',
      class: 'Password',
      gridColumns: 4
    },
    {
      name: 'site',
      class: 'String',
      gridColumns: 4
    },
    {
      name: 'loginId',
      class: 'String',
      gridColumns: 4
    },
    {
      name: 'username',
      class: 'String',
      gridColumns: 4
    },
    {
      name: 'email',
      class: 'EMail',
      gridColumns: 4
    },
    {
      name: 'memo',
      class: 'Code',
      view: {
        class: 'foam.u2.tag.TextArea',
        rows: 4, cols: 60,
      },
      gridColumns: 6
    },
    {
      name: 'recoveryEmail',
      class: 'EMail',
      gridColumns: 6
    },
    {
      name: 'securityQuestions',
      class: 'Map',
      gridColumns: 6
    },
    {
      class: 'foam.core.fs.FileArray',
      name: 'attachments',
      tableCellFormatter: function(files) {
        if ( ! (Array.isArray(files) && files.length > 0) ) return;
        var actions = files.map((file) => {
          return foam.lang.Action.create({
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
          class: 'foam.core.fs.fileDropZone.FileDropZone',
          files$: x.data.attachments$,
          supportedFormats: {
            '*' : 'Any'
          }
        };
      },
      gridColumns: 6
    },
    {
      name: 'createdByAgent',
      visibility: 'HIDDEN'
    },
    {
      name: 'lastModifiedByAgent',
      visibility: 'HIDDEN'
    }
  ],

  methods: [
    {
      name: 'toSummary',
      type: 'String',
      code: function() {
        return this.description;
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
        if ( user.getId() != this.getCreatedBy() &&
             user.getId() != this.getOwner() &&
             ! auth.check(x, "password.read." + this.getId()) ) {
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
             user.getId() != this.getOwner() &&
             ! auth.check(x, "password.update." + this.getId()) ) {
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
             user.getId() != this.getOwner() &&
             ! auth.check(x, "password.remove." + this.getId()) ) {
          throw new AuthorizationException();
        }
      `
    }

  ]
});
