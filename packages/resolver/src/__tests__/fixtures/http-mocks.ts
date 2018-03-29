export default {
  'https://raw.githubusercontent.com/bojand/json-schema-test-samples/master/id.json': {
    description: 'unique identifier of a the object',
    type: 'string',
    minLength: 1,
  },
  'https://raw.githubusercontent.com/bojand/json-schema-test-samples/master/foo.json': {
    description: 'foo property',
    readOnly: true,
    type: 'number',
  },
  'https://raw.githubusercontent.com/bojand/json-schema-test-samples/master/bar.json': {
    description: 'bar property',
    type: 'boolean',
  },
  'https://raw.githubusercontent.com/bojand/json-schema-test-samples/master/common-definitions.json': {
    $schema: 'http://json-schema.org/draft-04/schema#',
    description: 'Some common definitions',
    type: 'object',
    definitions: {
      id: {
        description: 'Unique identifier.',
        readOnly: true,
        format: 'uuid',
        example: '01234567-89ab-cdef-0123-456789abcdef',
        type: 'string',
        minLength: 1,
      },
      created_at: {
        description: 'Creation time.',
        example: '2014-07-25T19:14:29.503Z',
        format: 'date-time',
        readOnly: true,
        type: 'string',
      },
      updated_at: {
        description: 'Update date-time.',
        example: '2014-07-25T19:14:29.503Z',
        format: 'date-time',
        readOnly: false,
        type: 'string',
      },
      email: {
        description: 'Email',
        format: 'email',
        readOnly: false,
        type: 'string',
        minLength: 1,
      },
    },
  },
  'https://raw.githubusercontent.com/bojand/json-schema-test-samples/master/address.json': {
    $schema: 'http://json-schema.org/draft-04/schema#',
    description: 'A simple address schema',
    type: 'object',
    definitions: {
      address1: {
        type: 'string',
      },
      address2: {
        type: 'string',
      },
      city: {
        type: 'string',
      },
      postalCode: {
        type: 'string',
      },
      state: {
        type: 'string',
      },
      country: {
        type: 'string',
      },
    },
    properties: {
      address1: {
        $ref: '#/definitions/address1',
      },
      address2: {
        $ref: '#/definitions/address2',
      },
      city: {
        $ref: '#/definitions/city',
      },
      postalCode: {
        $ref: '#/definitions/postalCode',
      },
      state: {
        $ref: '#/definitions/state',
      },
      country: {
        $ref: '#/definitions/country',
      },
    },
  },
};
