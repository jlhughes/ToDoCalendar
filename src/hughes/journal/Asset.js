foam.CLASS({
  package: 'hughes.journal',
  name: 'Asset',

  implements: [
    'foam.nanos.auth.CreatedAware',
    'foam.nanos.auth.CreatedByAware'
  ],

  imports: [
    'eventDAO'
  ],

  tableColumns: [
    'name',
    'make',
    'model',
    'serialNumber'
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
      name: 'name',
      class: 'String',
      gridColumns: 6
    },
    {
      name: 'make',
      class: 'String',
      gridColumns: 6
    },
    {
      name: 'model',
      class: 'String',
      gridColumns: 6
    },
    {
      name: 'serialNumber',
      class: 'String',
      gridColumns: 6
    },
    {
      name: 'url',
      class: 'String',
      gridColumns: 6
    },
    {
      name: 'notes',
      class: 'Code',
      view: {
        class: 'foam.u2.tag.TextArea',
        rows: 4, cols: 60,
      },
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
      gridColumns: 6,
    }
  ],

  methods: [
    {
      name: 'toSummary',
      type: 'String',
      code: function() {
        return this.name;
      }
    }
  ],

  actions: [
    {
      name: 'event',
      isAvailable: function() {
        return this.id;
      },
      code: async function(X) {
        if ( X.memento ) {
          X = X.createSubContext({memento: X.memento.tail});
        }
        var event = hughes.journal.Event.create({
          asset: X.data.id,
          eventCategory: 'Maintenance'
        });

        X.stack.push({
          class: 'foam.comics.v2.DAOUpdateView',
          data: event,
          config: {
            class: 'foam.comics.v2.DAOControllerConfig',
            dao: X.eventDAO,
            browseTitle: `${this.toSummary()} Event`
          }
        }, X);
      }
    }
  ]
});
