foam.CLASS({
  package: 'hughes.ledger',
  name: 'AccountCode',

  documentation: 'Account category for ledger use',

  tableColumns: [
    'id'
  ],

  properties: [
    {
      name: 'id',
      class: 'String',
      createVisibility: 'RW',
      updateVisibility: 'RO'
    },
    // {
    //   // TODO: string.labalize
    //   name: 'name',
    //   class: 'String'
    // }
  ]
});
