export const userMutations = {
  signUp: `
  mutation signUp($input: SignUpInput!) {
    signUp(input: $input) {
      success
      user {
        email
        name
        role
        isAdmin
        isEmployer
        isSuperAdmin
        uuid
        createdAt
        updatedAt,
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
