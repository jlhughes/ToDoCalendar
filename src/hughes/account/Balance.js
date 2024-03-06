foam.CLASS({
  package: 'hughes.account',
  name: 'Balance',

  ids: ['account'],

  imports: [
    'accountDAO'
  ],

  properties: [
    {
      class: 'Reference',
      of: 'hughes.account.Account',
      name: 'account',
      visibility: 'RO',
      tableCellFormatter: function(value, obj) {
        obj.accountDAO.find(value).then(function(acc) {
          if ( acc ) {
            this.add(value + ' - ' + acc.toSummary());
          } else {
            this.add(value);
          }
        }.bind(this));
      }
    },
    {
      name: 'balance',
      class: 'Long',
      visibility: 'RO'
    }
  ]
});
