foam.CLASS({
  package: 'hughes.journal',
  name: 'Asset',

  implements: [
    'foam.core.auth.CreatedAware',
    'foam.core.auth.CreatedByAware'
  ],

  imports: [
    'eventDAO'
  ],

  tableColumns: [
    'tag',
    'name',
    'make',
    'model',
    'serialNumber',
    'location'
  ],

  properties: [
    {
      name: 'id',
      class: 'String',
      placeholder: 'auto generated',
      visibility: 'RO',
      gridColumns: 6
    },
    {
      name: 'tag',
      class: 'String',
      placeholder: 'defaults to id',
      factory: function() { return this.id; },
      javaFactory: 'return getId();',
      gridColumns: 6
    },
    {
      name: 'name',
      class: 'String',
      label: 'Name/Description',
      required: true,
      gridColumns: 4
    },
    {
      name: 'make',
      class: 'String',
      gridColumns: 4
    },
    {
      name: 'model',
      class: 'String',
      gridColumns: 4
    },
    {
      name: 'serialNumber',
      class: 'String',
      gridColumns: 4
    },
    {
      name: 'location',
      class: 'String',
      gridColumns: 4
    },
    {
      name: 'url',
      class: 'String',
      gridColumns: 4
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
      gridColumns: 6,
    },
    {
      name: 'createdByAgent',
      visibility: 'HIDDEN'
    }
  ],

  methods: [
    {
      name: 'toSummary',
      type: 'String',
      code: function() {
        return this.name + (this.location ? ' ('+this.location+')' : '');
      }
    },
    {
      name: 'assetNumber',
      type: 'String',
      code: function() {
        return this.tag || this.id;
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
