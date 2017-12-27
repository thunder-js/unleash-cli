import fetch from 'node-fetch';
import * as https from 'https';

import {
  introspectionQuery,
} from 'graphql/utilities';


const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export default async (url) => {
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

  return schemaData
}
