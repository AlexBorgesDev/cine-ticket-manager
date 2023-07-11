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
        items
        message
        statusCode
        type
      }
    }
  }`,
};

export const userQueries = {
  user: `query {
    user {
      email
      name
      role
      uuid
      createdAt
      updatedAt
      isAdmin
      isEmployer
      isSuperAdmin
    }
  }`,
};
