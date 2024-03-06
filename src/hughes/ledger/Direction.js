foam.ENUM({
  package: 'hughes.ledger',
  name: 'Direction',

  values: [
    {
      documentation: 'Move funds into an account',
      name: 'CREDIT',
      ordinal: 1,
      multiplier: 1
    },
    {
      documentation: 'Move funds out of an account',
      name: 'DEBIT',
      ordinal: -1,
      multiplier: -1
    }
  ],

  properties: [
    {
      documentation: 'Multiplier applied to positive transaction amount to calculate amount that is applied account balance.',
      name: 'multiplier',
      class: 'Int',
      value: 1
    }
  ]
})
