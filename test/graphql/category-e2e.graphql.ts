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
        code
        items
        message
        statusCode
        type
      }
    }
  }`,
};
