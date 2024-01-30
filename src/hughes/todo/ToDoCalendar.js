foam.CLASS({
  package: 'hughes.todo',
  name: 'ToDoCalendar',
	
	implements: [
		'foam.nanos.auth.CreatedAware',
		'foam.nanos.auth.CreatedByAware',
		'foam.nanos.auth.LastModifiedAware',
		'foam.nanos.auth.LastModifiedByAware'
	],
	properties: [
    {
      name: 'id',
      class: 'String',
			createVisibility: 'HIDDEN',
			updateVisibility: 'RO'
    },
    {
      name: 'description',
      class: 'String',
			required: true
    },
		{
			name: 'startDate',
			class: 'DateTime',
			label: 'Start Date and Time',
			required: true
		},
		{
			name: 'allDay',
			class: 'Boolean'
		},
		{
			name: 'endDate',
			class: 'DateTime',
			label: 'End Date and Time',
			required: false
		},
		{
			name: 'memo',
			class: 'Code',
		      view: { 
        class: 'foam.u2.tag.TextArea', 
        rows: 10, cols: 80, 
      }
		}
  ]
})
