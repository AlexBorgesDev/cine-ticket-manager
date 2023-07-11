export const directorMutations = {
  createDirector: `
  mutation createDirector($input: CreateDirectorInput!) {
    createDirector(input: $input) {
      success
      director {
        name
        uuid
        createdAt
        updatedAt
      }
      error {
        items
        message
        statusCode
        type
      }
    }
  }`,
};
