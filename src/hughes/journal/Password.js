foam.CLASS({
  package: 'hughes.journal',
  name: 'Password',

  documentation: ``,

  implements: [
    'foam.nanos.auth.CreatedAware',
    'foam.nanos.auth.CreatedByAware',
    'foam.nanos.auth.LastModifiedAware',
    'foam.nanos.auth.LastModifiedByAware'
  ],

  imports: [
    'userDAO'
  ],

  javaImports: [
    'foam.core.X'
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
      gridColumns: 6
    },
    {
      name: 'owner',
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      tableCellFormatter: function(value, obj) {
        var self = this;
        obj.userDAO.find(value).then(function(u) {
          self.add(u.toSummary());
        });
      },
      gridColumns: 6
    },
    {
      name: 'description',
      class: 'String',
      gridColumns: 6
    },
    {
      name: 'site',
      class: 'String',
      gridColumns: 6
    },
    {
      name: 'password',
      class: 'Password',
      gridColumns: 6
    },
    {
      name: 'loginId',
      class: 'String',
      gridColumns: 6
    },
    {
      name: 'username',
      class: 'String',
      gridColumns: 6
    },
    {
      name: 'memo',
      class: 'Code',
      view: {
        class: 'foam.u2.tag.TextArea',
        rows: 4, cols: 60,
      },
//      order: 8,
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
          files$: x.data.attachments$,
          supportedFormats: {
            '*' : 'Any'
          }
        };
      },
//      order: 10,
      gridColumns: 6,
    }
  ]
});
