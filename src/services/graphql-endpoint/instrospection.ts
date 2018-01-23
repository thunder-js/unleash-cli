import fetch from 'node-fetch';
import { introspectionQuery } from 'graphql/utilities';
import { IntrospectionSchema } from 'graphql';

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export const fetchInstrospectionSchema = async (url: string): Promise<IntrospectionSchema> => {
  const headers = defaultHeaders

  let result;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: introspectionQuery }),
    });

    result = await response.json();
  } catch (error) {
    throw new Error(`Error while fetching introspection query result: ${error.message}`);
  }

  if (result.errors) {
    throw new Error(`Errors in introspection query result: ${result.errors}`);
  }

  const schemaData = result;
  if (!schemaData.data) {
    throw new Error(`No introspection query result data found, server responded with: ${JSON.stringify(result)}`);
  }

  return schemaData.data.__schema
}
