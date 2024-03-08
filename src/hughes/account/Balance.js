foam.CLASS({
  package: 'hughes.account',
  name: 'Balance',

  ids: ['account'],

  imports: [
    'accountDAO',
    'currencyDAO'
  ],

  properties: [
    {
      class: 'Reference',
      of: 'hughes.account.Account',
      name: 'account',
      visibility: 'RO',
      tableCellFormatter: function(value, obj) {
        var self = this;
        obj.accountDAO.find(value).then(function(acc) {
          if ( acc ) {
            self.add(acc.toSummary());
          } else {
            self.add(value);
          }
        });
      }
    },
    {
      name: 'balance',
      class: 'Long',
      visibility: 'RO',
      tableCellFormatter: function(value, obj) {
        var self = this;
        obj.accountDAO.find(obj.account).then(function(a) {
          obj.currencyDAO.find(a.currency).then(function(c) {
            if ( c ) {
              self.add(c.format(value));
            } else {
              self.add(value);
            }
          });
        });
      }
    }
  ]
});
