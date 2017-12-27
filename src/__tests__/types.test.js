import getModel, { compileGraphQLTypeToTypeScript } from '../modules/common/types'

const url = 'http://localhost:9002/graphql'

describe('types', () => {
  it('works', async () => {
    const model = await getModel('src/resources/query.ts', url)
    const expected = [{
      name: 'name',
      type: {
        key: 'name?',
        value: 'string',
      },
    }, {
      name: 'description',
      type: {
        key: 'description?',
        value: 'string',
      },
    }, {
      name: 'imageUrl',
      type: {
        key: 'imageUrl?',
        value: 'string',
      },
    }, {
      name: 'participants',
      type: {
        key: 'participants?',
        value: 'any',
      },
    }]
    expect(model).toEqual(expected)
  })
})


const graphQLType = {
  name: 'description',
  type: {
    kind: 'NON_NULL',
    ofType: {
      kind: 'SCALAR',
      name: 'String',
    },
  },
}

const expected = {
  key: 'description',
  value: 'string',
}


describe('compileGraphQLTypeToTypeScript', () => {
  it('can compile a simple type', () => {
    expect(compileGraphQLTypeToTypeScript(graphQLType)).toEqual(expected)
  })
  it('can compile a type with array', () => {
    expect(compileGraphQLTypeToTypeScript({
      name: 'friends',
      type: {
        kind: 'LIST',
        ofType: {
          kind: 'SCALAR',
          name: 'String',
        },
      },
    })).toEqual({
      key: 'friends?',
      value: 'Array<string>',
    })
  })
  it('can compile a nullable type', () => {
    expect(compileGraphQLTypeToTypeScript({
      name: 'carName',
      type: {
        kind: 'SCALAR',
        name: 'String',
      },
    })).toEqual({
      key: 'carName?',
      value: 'string',
    })
  })
  it('can compile a object type', () => {
    expect(compileGraphQLTypeToTypeScript({
      name: 'user',
      type: {
        kind: 'NON_NULL',
        ofType: {
          kind: 'OBJECT',
          name: 'User',
          ofType: null,
        },
      },
    })).toEqual({
      key: 'user',
      value: 'any',
    })
  })
})
