export const categoryMutations = {
  createCategory: `
  mutation createCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      success
      category {
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
