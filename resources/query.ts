import gql from 'graphql-tag'

export default gql`
	query allCharacters{
    viewer {
      allCharacters {
        edges {
          node {
            name
            description
            imageUrl
            participants {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`
